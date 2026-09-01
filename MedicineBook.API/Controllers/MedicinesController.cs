using CsvHelper;
using ClosedXML.Excel;
using MedicineBook.API.Data;
using MedicineBook.API.Models;
using MedicineBook.API.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Text.Json;

namespace MedicineBook.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MedicinesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public MedicinesController(ApplicationDbContext context, IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Medicine>>> GetMedicines([FromQuery] int page = 1, [FromQuery] int pageSize = 50, [FromQuery] string search = "")
        {
            var query = _context.Medicines.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                var lowerSearch = search.ToLower();
                query = query.Where(m => m.Name.ToLower().Contains(lowerSearch) || (m.Category != null && m.Category.ToLower().Contains(lowerSearch)));
            }

            var totalItems = await query.CountAsync();
            var medicines = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                TotalItems = totalItems,
                Page = page,
                PageSize = pageSize,
                Data = medicines
            });
        }

        [HttpPost("upload")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadMedicines(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("File is empty or not provided.");

            var medicines = new List<Medicine>();
            var extension = Path.GetExtension(file.FileName).ToLower();

            try
            {
                if (extension == ".csv")
                {
                    using var stream = new StreamReader(file.OpenReadStream());
                    using var csv = new CsvReader(stream, CultureInfo.InvariantCulture);
                    var records = csv.GetRecords<MedicineDto>().ToList();
                    medicines = MapToEntity(records);
                }
                else if (extension == ".xlsx")
                {
                    using var stream = file.OpenReadStream();
                    using var workbook = new XLWorkbook(stream);
                    var worksheet = workbook.Worksheets.First();
                    var rows = worksheet.RangeUsed().RowsUsed().Skip(1); // Skip header

                    foreach (var row in rows)
                    {
                        var medicine = new Medicine
                        {
                            Name = row.Cell(1).GetValue<string>(),
                            Category = row.Cell(2).GetValue<string>(),
                            Description = row.Cell(3).GetValue<string>(),
                            Quantity = row.Cell(4).TryGetValue<int>(out var q) ? q : 0,
                            Price = row.Cell(5).TryGetValue<decimal>(out var p) ? p : 0,
                            ExpiryDate = row.Cell(6).TryGetValue<DateTime>(out var d) ? d : DateTime.MinValue,
                            BatchNumber = row.Cell(7).GetValue<string>(),
                            Supplier = row.Cell(8).GetValue<string>(),
                            TipsAndTricks = null
                        };
                        medicines.Add(medicine);
                    }
                }
                else
                {
                    return BadRequest("Only CSV and Excel files are supported.");
                }

                if (medicines.Any())
                {
                    _context.Medicines.AddRange(medicines);
                    await _context.SaveChangesAsync();
                }

                return Ok(new { Status = "Success", Message = $"{medicines.Count} medicines uploaded successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Status = "Error", Message = $"Failed to process file: {ex.Message}" });
            }
        }

        [HttpGet("test-internet")]
        [AllowAnonymous]
        public async Task<IActionResult> TestInternet()
        {
            try {
                var client = _httpClientFactory.CreateClient();
                var res = await client.GetAsync("https://www.google.com");
                return Ok(new { Success = res.IsSuccessStatusCode, Status = res.StatusCode });
            } catch (Exception ex) {
                return Ok(new { Success = false, Error = ex.Message });
            }
        }

        [HttpGet("scrape")]
        public async Task<IActionResult> ScrapeMedicineInfo([FromQuery] int? id, [FromQuery] string? name, [FromQuery] bool refresh = false)
        {
            Medicine? medicine = null;
            if (id.HasValue && id.Value > 0)
            {
                medicine = await _context.Medicines.FindAsync(id.Value);
            }
            else if (!string.IsNullOrEmpty(name))
            {
                medicine = await _context.Medicines.FirstOrDefaultAsync(m => m.Name == name || m.Category == name);
            }

            if (medicine == null && string.IsNullOrEmpty(name))
            {
                return BadRequest(new { Status = "Error", Message = "Medicine ID or Name is required" });
            }

            // Return cached / saved overview if available and not explicitly refreshing
            if (!refresh && medicine != null && !string.IsNullOrEmpty(medicine.AiOverview))
            {
                return Ok(new
                {
                    Status = "Success",
                    Source = "Saved Database Overview",
                    IsCached = true,
                    GeneratedAt = medicine.AiOverviewGeneratedAt,
                    Data = new AggregatedScrapeResultDto
                    {
                        AiSummary = new AiSummaryDto { Content = medicine.AiOverview }
                    }
                });
            }

            try
            {
                var client = _httpClientFactory.CreateClient();
                client.Timeout = TimeSpan.FromSeconds(45);
                client.DefaultRequestHeaders.Add("User-Agent", "MedicineBookApp/1.0 (contact@tafawsolutions.com)");

                var targetName = medicine?.Category ?? medicine?.Name ?? name ?? "";
                var summary = await GenerateStructuredAiOverview(client, medicine, targetName);

                if (summary != null && !string.IsNullOrEmpty(summary.Content) && medicine != null)
                {
                    medicine.AiOverview = summary.Content;
                    medicine.AiOverviewGeneratedAt = DateTime.UtcNow;
                    _context.Medicines.Update(medicine);
                    await _context.SaveChangesAsync();
                }

                var aggregatedResult = new AggregatedScrapeResultDto
                {
                    AiSummary = summary
                };

                return Ok(new
                {
                    Status = "Success",
                    Source = "AI Insights",
                    IsCached = false,
                    GeneratedAt = DateTime.UtcNow,
                    Data = aggregatedResult
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Status = "Error", Message = ex.Message });
            }
        }

        private async Task<AiSummaryDto?> GenerateStructuredAiOverview(HttpClient client, Medicine? medicine, string targetName)
        {
            try
            {
                var settings = await _context.SystemSettings.ToDictionaryAsync(s => s.Key, s => s.Value);

                string apiKey = "";
                if (settings.TryGetValue("AI:ApiKey", out var ak) && !string.IsNullOrEmpty(ak))
                {
                    apiKey = ak;
                }
                else if (settings.TryGetValue("OpenRouter:ApiKey", out var oak) && !string.IsNullOrEmpty(oak))
                {
                    apiKey = oak;
                }
                else
                {
                    apiKey = _configuration["OpenRouter:ApiKey"] ?? "";
                }

                if (string.IsNullOrEmpty(apiKey)) return null;

                string endpoint = "https://integrate.api.nvidia.com/v1/chat/completions";
                if (settings.TryGetValue("AI:Endpoint", out var ep) && !string.IsNullOrEmpty(ep))
                {
                    endpoint = ep;
                }
                else if (settings.TryGetValue("AI:Provider", out var prov) && prov == "OpenRouter")
                {
                    endpoint = "https://openrouter.ai/api/v1/chat/completions";
                }

                string model = "deepseek-ai/deepseek-r1";
                if (settings.TryGetValue("AI:Model", out var m) && !string.IsNullOrEmpty(m))
                {
                    model = m;
                }
                else if (endpoint.Contains("openrouter.ai"))
                {
                    model = "openai/gpt-4o";
                }

                string systemPrompt = @"You are a clinical pharmacologist and medical AI specialist.
You MUST output ONLY a valid, raw JSON object (with no markdown backticks, no code block markers, and no text outside the JSON).

The JSON object MUST strictly adhere to this schema:
{
  ""summary"": ""Concise 1-2 sentence clinical summary of the medicine."",
  ""classification"": ""Therapeutic drug class / category"",
  ""indications"": [
    ""Primary indication 1"",
    ""Indication 2""
  ],
  ""mechanismOfAction"": ""Clinical mechanism of action and pharmacodynamics."",
  ""dosageAndAdministration"": [
    { ""indicationOrRoute"": ""Adult Dosage / Route"", ""dosage"": ""Specific dosage, frequency, and administration instructions"" }
  ],
  ""precautionsAndWarnings"": [
    ""Key clinical warning or monitoring requirement"",
    ""Black box warning if applicable""
  ],
  ""contraindications"": [
    ""Key contraindication 1"",
    ""Key contraindication 2""
  ],
  ""commonSideEffects"": [
    ""Common side effect 1"",
    ""Side effect 2""
  ],
  ""workflowAndDispensingNotes"": [
    ""Storage, handling, or dispensing safety notes based on provided workflow & tips""
  ]
}";

                if (settings.TryGetValue("AI:SystemPrompt", out var sp) && !string.IsNullOrWhiteSpace(sp))
                {
                    systemPrompt = sp;
                }

                // Build contextual prompt from Medicine data (Workflow Card + Tips)
                var userPromptBuilder = new System.Text.StringBuilder();
                userPromptBuilder.AppendLine($"Medicine: {targetName}");

                if (medicine != null)
                {
                    if (!string.IsNullOrEmpty(medicine.Name) && medicine.Name != targetName)
                    {
                        userPromptBuilder.AppendLine($"Medicine Code / Identifier: {medicine.Name}");
                    }
                    if (!string.IsNullOrEmpty(medicine.Description))
                    {
                        userPromptBuilder.AppendLine($"Existing Description: {medicine.Description}");
                    }
                    if (!string.IsNullOrEmpty(medicine.TipsAndTricks))
                    {
                        userPromptBuilder.AppendLine($"Staff Tips & Tricks:\n{medicine.TipsAndTricks}");
                    }

                    // Parse WorkflowData if available
                    if (!string.IsNullOrEmpty(medicine.WorkflowData))
                    {
                        try
                        {
                            using var wfDoc = JsonDocument.Parse(medicine.WorkflowData);
                            var wfRoot = wfDoc.RootElement;
                            var wfNotes = new List<string>();

                            if (wfRoot.TryGetProperty("steps", out var steps) && steps.ValueKind == JsonValueKind.Array)
                            {
                                foreach (var step in steps.EnumerateArray())
                                {
                                    if (step.TryGetProperty("title", out var stTitle))
                                    {
                                        var desc = step.TryGetProperty("description", out var stDesc) ? stDesc.GetString() : "";
                                        wfNotes.Add($"- {stTitle.GetString()}: {desc}");
                                    }
                                }
                            }
                            if (wfRoot.TryGetProperty("precautions", out var precautions) && precautions.ValueKind == JsonValueKind.Array)
                            {
                                foreach (var p in precautions.EnumerateArray())
                                {
                                    wfNotes.Add($"- Precaution: {p.GetString()}");
                                }
                            }

                            if (wfNotes.Count > 0)
                            {
                                userPromptBuilder.AppendLine($"Workflow Guidelines & Steps:\n{string.Join("\n", wfNotes)}");
                            }
                        }
                        catch { }
                    }
                }

                userPromptBuilder.AppendLine("\nProvide the complete structured clinical overview strictly in the requested JSON format. Return ONLY the JSON object.");

                var request = new HttpRequestMessage(HttpMethod.Post, endpoint);
                request.Headers.Add("Authorization", $"Bearer {apiKey}");

                var payload = new
                {
                    model = model,
                    messages = new[]
                    {
                        new { role = "system", content = systemPrompt },
                        new { role = "user", content = userPromptBuilder.ToString() }
                    },
                    temperature = 0.5
                };

                request.Content = new StringContent(JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");

                var response = await client.SendAsync(request);
                if (!response.IsSuccessStatusCode) return null;

                var jsonString = await response.Content.ReadAsStringAsync();
                using var document = JsonDocument.Parse(jsonString);

                if (document.RootElement.TryGetProperty("choices", out var choices) && choices.GetArrayLength() > 0)
                {
                    var firstChoice = choices[0];
                    if (firstChoice.TryGetProperty("message", out var message) && message.TryGetProperty("content", out var content))
                    {
                        var rawText = content.GetString() ?? "";
                        var cleanJson = ExtractCleanJson(rawText);
                        return new AiSummaryDto { Content = cleanJson };
                    }
                }
            }
            catch { }
            return null;
        }

        private static string ExtractCleanJson(string raw)
        {
            if (string.IsNullOrWhiteSpace(raw)) return "";

            var text = raw.Trim();
            if (text.Contains("</think>"))
            {
                text = text.Substring(text.IndexOf("</think>") + 8).Trim();
            }

            if (text.StartsWith("```json", StringComparison.OrdinalIgnoreCase))
            {
                text = text.Substring(7);
            }
            else if (text.StartsWith("```"))
            {
                text = text.Substring(3);
            }

            if (text.EndsWith("```"))
            {
                text = text.Substring(0, text.Length - 3);
            }

            text = text.Trim();

            try
            {
                using var doc = JsonDocument.Parse(text);
                return text;
            }
            catch
            {
                int firstBrace = text.IndexOf('{');
                int lastBrace = text.LastIndexOf('}');
                if (firstBrace >= 0 && lastBrace > firstBrace)
                {
                    var candidate = text.Substring(firstBrace, lastBrace - firstBrace + 1);
                    try
                    {
                        using var doc = JsonDocument.Parse(candidate);
                        return candidate;
                    }
                    catch { }
                }
                return text;
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateMedicine([FromBody] MedicineDto model)
        {
            var medicine = new Medicine
            {
                Name = model.Name,
                Category = model.Category,
                Description = model.Description,
                Quantity = model.Quantity,
                Price = model.Price,
                ExpiryDate = model.ExpiryDate,
                BatchNumber = model.BatchNumber,
                Supplier = model.Supplier,
                WorkflowData = model.WorkflowData,
                TipsAndTricks = model.TipsAndTricks
            };

            _context.Medicines.Add(medicine);
            await _context.SaveChangesAsync();

            return Ok(new { Status = "Success", Message = "Medicine added successfully!", Data = medicine });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateMedicine(int id, [FromBody] MedicineDto model)
        {
            var medicine = await _context.Medicines.FindAsync(id);
            if (medicine == null)
                return NotFound(new { Status = "Error", Message = "Medicine not found!" });

            medicine.Name = model.Name;
            medicine.Category = model.Category;
            medicine.Description = model.Description;
            medicine.Quantity = model.Quantity;
            medicine.Price = model.Price;
            medicine.ExpiryDate = model.ExpiryDate;
            medicine.BatchNumber = model.BatchNumber;
            medicine.Supplier = model.Supplier;
            medicine.WorkflowData = model.WorkflowData;
            medicine.TipsAndTricks = model.TipsAndTricks;

            _context.Medicines.Update(medicine);
            await _context.SaveChangesAsync();

            return Ok(new { Status = "Success", Message = "Medicine updated successfully!" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteMedicine(int id)
        {
            var medicine = await _context.Medicines.FindAsync(id);
            if (medicine == null)
                return NotFound(new { Status = "Error", Message = "Medicine not found!" });

            _context.Medicines.Remove(medicine);
            await _context.SaveChangesAsync();

            return Ok(new { Status = "Success", Message = "Medicine deleted successfully!" });
        }

        [HttpGet("{id}/files")]
        public async Task<IActionResult> GetMedicineFiles(int id, [FromQuery] string category = "General")
        {
            var medicine = await _context.Medicines
                .Include(m => m.Files)
                .FirstOrDefaultAsync(m => m.Id == id);
            
            if (medicine == null)
                return NotFound(new { Status = "Error", Message = "Medicine not found!" });

            var files = medicine.Files?
                .Where(f => string.IsNullOrEmpty(category) || f.Category == category || (category == "General" && string.IsNullOrEmpty(f.Category)))
                .OrderByDescending(f => f.UploadedAt)
                .ToList() ?? new List<MedicineFile>();

            return Ok(new { Status = "Success", Data = files });
        }

        [HttpPost("{id}/files")]
        [Authorize(Roles = "Admin")]
        [RequestSizeLimit(100_000_000)] // 100MB limit for video/large files
        public async Task<IActionResult> UploadMedicineFiles(int id, [FromForm] List<IFormFile> files, [FromForm] string category = "General")
        {
            var medicine = await _context.Medicines.FindAsync(id);
            if (medicine == null)
                return NotFound(new { Status = "Error", Message = "Medicine not found!" });

            if (files == null || files.Count == 0)
                return BadRequest(new { Status = "Error", Message = "No files uploaded." });

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "medicines", id.ToString());
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var uploadedFiles = new List<MedicineFile>();

            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    // Clean file name for safety and uniqueness
                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(file.FileName).Replace(" ", "_");
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    var medicineFile = new MedicineFile
                    {
                        MedicineId = id,
                        FileName = file.FileName,
                        FilePath = $"/uploads/medicines/{id}/{uniqueFileName}",
                        ContentType = file.ContentType,
                        FileSize = file.Length,
                        UploadedAt = DateTime.UtcNow,
                        Category = category
                    };

                    _context.MedicineFiles.Add(medicineFile);
                    uploadedFiles.Add(medicineFile);
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { Status = "Success", Message = $"{uploadedFiles.Count} files uploaded successfully.", Data = uploadedFiles });
        }

        [HttpDelete("files/{fileId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteMedicineFile(int fileId)
        {
            var file = await _context.MedicineFiles.FindAsync(fileId);
            if (file == null)
                return NotFound(new { Status = "Error", Message = "File not found!" });

            var physicalPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", file.FilePath.TrimStart('/'));
            if (System.IO.File.Exists(physicalPath))
            {
                System.IO.File.Delete(physicalPath);
            }

            _context.MedicineFiles.Remove(file);
            await _context.SaveChangesAsync();

            return Ok(new { Status = "Success", Message = "File deleted successfully!" });
        }

        private List<Medicine> MapToEntity(List<MedicineDto> dtos)
        {
            return dtos.Select(d => new Medicine
            {
                Name = d.Name,
                Category = d.Category,
                Description = d.Description,
                Quantity = d.Quantity,
                Price = d.Price,
                ExpiryDate = d.ExpiryDate,
                BatchNumber = d.BatchNumber,
                Supplier = d.Supplier,
                WorkflowData = d.WorkflowData,
                TipsAndTricks = d.TipsAndTricks
            }).ToList();
        }
    }

    public class MedicineDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Category { get; set; }
        public string? Description { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string? BatchNumber { get; set; }
        public string? Supplier { get; set; }
        public string? WorkflowData { get; set; }
        public string? TipsAndTricks { get; set; }
    }
}
