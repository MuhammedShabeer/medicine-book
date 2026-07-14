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

        public MedicinesController(ApplicationDbContext context, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
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
        public async Task<IActionResult> ScrapeMedicineInfo([FromQuery] string name)
        {
            if (string.IsNullOrEmpty(name)) return BadRequest(new { Status = "Error", Message = "Name is required" });
            
            try
            {
                var client = _httpClientFactory.CreateClient();
                // Use a standard bot user-agent to avoid being blocked by Wikipedia's policy
                client.DefaultRequestHeaders.Add("User-Agent", "MedicineBookApp/1.0 (contact@tafawsolutions.com)");

                var wellcareTask = ScrapeWellcare(client, name);
                var wikiTask = ScrapeWikipedia(client, name);
                var ddgTask = ScrapeDuckDuckGo(client, name);
                var fdaTask = ScrapeOpenFda(client, name);

                await Task.WhenAll(wellcareTask, wikiTask, ddgTask, fdaTask);

                var aggregatedResult = new AggregatedScrapeResultDto
                {
                    Wellcare = wellcareTask.Result,
                    Wikipedia = wikiTask.Result,
                    DuckDuckGo = ddgTask.Result,
                    OpenFda = fdaTask.Result
                };

                return Ok(new { Status = "Success", Source = "Aggregated AI Mode", Data = aggregatedResult });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Status = "Error", Message = ex.Message });
            }
        }

        private async Task<List<ScrapedMedicineDto>> ScrapeWellcare(HttpClient client, string name)
        {
            var results = new List<ScrapedMedicineDto>();
            try
            {
                var url = $"https://www.wellcareonline.com/search/suggest.json?q={Uri.EscapeDataString(name)}&resources[type]=product";
                var response = await client.GetAsync(url);
                if (!response.IsSuccessStatusCode) {
                    var err = await response.Content.ReadAsStringAsync();
                    throw new Exception($"HTTP {response.StatusCode}: {err}");
                }

                var jsonString = await response.Content.ReadAsStringAsync();
                using var document = JsonDocument.Parse(jsonString);
                
                if (document.RootElement.TryGetProperty("resources", out var resources) &&
                    resources.TryGetProperty("results", out var resultsNode) &&
                    resultsNode.TryGetProperty("products", out var productsArray))
                {
                    foreach (var product in productsArray.EnumerateArray())
                    {
                        var title = product.TryGetProperty("title", out var t) ? t.GetString() : "Unknown";
                        var body = product.TryGetProperty("body", out var b) ? b.GetString() : "";
                        var price = product.TryGetProperty("price", out var p) ? p.GetString() : "0.00";
                        var productUrl = product.TryGetProperty("url", out var u) ? u.GetString() : "";
                        var imageUrl = product.TryGetProperty("image", out var img) ? img.GetString() : "";

                        if (!string.IsNullOrEmpty(body))
                            body = System.Text.RegularExpressions.Regex.Replace(body, "<.*?>", String.Empty).Trim();

                        results.Add(new ScrapedMedicineDto
                        {
                            Title = title!,
                            Description = body,
                            Price = $"QAR {price}",
                            ImageUrl = imageUrl,
                            ProductUrl = string.IsNullOrEmpty(productUrl) ? null : $"https://www.wellcareonline.com{productUrl}"
                        });
                        
                        if (results.Count >= 5) break;
                    }
                }
            }
            catch (Exception ex) { 
                results.Add(new ScrapedMedicineDto { Title = "Error", Description = ex.Message });
            }
            return results;
        }

        private async Task<WikipediaDto?> ScrapeWikipedia(HttpClient client, string name)
        {
            try
            {
                var url = $"https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&titles={Uri.EscapeDataString(name)}&format=json";
                var response = await client.GetAsync(url);
                if (!response.IsSuccessStatusCode) return null;

                var jsonString = await response.Content.ReadAsStringAsync();
                using var document = JsonDocument.Parse(jsonString);

                if (document.RootElement.TryGetProperty("query", out var query) &&
                    query.TryGetProperty("pages", out var pages))
                {
                    foreach (var page in pages.EnumerateObject())
                    {
                        if (page.Value.TryGetProperty("extract", out var extract) && !string.IsNullOrWhiteSpace(extract.GetString()))
                        {
                            var summary = extract.GetString()!;
                            summary = System.Text.RegularExpressions.Regex.Replace(summary, "<.*?>", String.Empty).Trim();
                            return new WikipediaDto { Summary = summary, Url = $"https://en.wikipedia.org/wiki/{Uri.EscapeDataString(name)}" };
                        }
                    }
                }
            }
            catch { }
            return null;
        }

        private async Task<DuckDuckGoDto?> ScrapeDuckDuckGo(HttpClient client, string name)
        {
            try
            {
                var request = new HttpRequestMessage(HttpMethod.Post, "https://html.duckduckgo.com/html/");
                request.Content = new FormUrlEncodedContent(new[] { new KeyValuePair<string, string>("q", name) });
                
                var response = await client.SendAsync(request);
                if (!response.IsSuccessStatusCode) return new DuckDuckGoDto { Snippet = "Error: " + response.StatusCode, Url = "" };

                var html = await response.Content.ReadAsStringAsync();
                var snippetStart = html.IndexOf("class=\"result__snippet");
                if (snippetStart != -1)
                {
                    snippetStart = html.IndexOf(">", snippetStart) + 1;
                    var snippetEnd = html.IndexOf("</a>", snippetStart);
                    if (snippetEnd != -1)
                    {
                        var snippet = html.Substring(snippetStart, snippetEnd - snippetStart);
                        snippet = System.Text.RegularExpressions.Regex.Replace(snippet, "<.*?>", String.Empty).Trim();
                        return new DuckDuckGoDto { Snippet = snippet, Url = $"https://duckduckgo.com/?q={Uri.EscapeDataString(name)}" };
                    }
                }
            }
            catch { }
            return null;
        }

        private async Task<OpenFdaDto?> ScrapeOpenFda(HttpClient client, string name)
        {
            try
            {
                var searchQ = $"openfda.brand_name:\"{Uri.EscapeDataString(name)}\"+openfda.generic_name:\"{Uri.EscapeDataString(name)}\"";
                var url = $"https://api.fda.gov/drug/label.json?search={searchQ}&limit=1";
                var response = await client.GetAsync(url);
                if (!response.IsSuccessStatusCode) return null;

                var jsonString = await response.Content.ReadAsStringAsync();
                using var document = JsonDocument.Parse(jsonString);

                if (document.RootElement.TryGetProperty("results", out var results) && results.GetArrayLength() > 0)
                {
                    var result = results[0];
                    var fda = new OpenFdaDto();
                    
                    if (result.TryGetProperty("active_ingredient", out var activeArr) && activeArr.GetArrayLength() > 0)
                        fda.ActiveIngredient = activeArr[0].GetString();

                    if (result.TryGetProperty("purpose", out var purposeArr) && purposeArr.GetArrayLength() > 0)
                        fda.Purpose = purposeArr[0].GetString();

                    if (result.TryGetProperty("warnings", out var warnArr) && warnArr.GetArrayLength() > 0)
                        fda.Warnings = warnArr[0].GetString();

                    if (result.TryGetProperty("indications_and_usage", out var usageArr) && usageArr.GetArrayLength() > 0)
                        fda.IndicationsAndUsage = usageArr[0].GetString();

                    return fda;
                }
            }
            catch { }
            return null;
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
                Supplier = model.Supplier
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
                Supplier = d.Supplier
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
    }
}
