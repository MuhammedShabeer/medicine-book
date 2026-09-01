using MedicineBook.API.Data;
using MedicineBook.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MedicineBook.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class SettingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public SettingsController(ApplicationDbContext context, IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSettings()
        {
            var list = await _context.SystemSettings.ToListAsync();
            var dict = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            foreach (var s in list)
            {
                dict[s.Key] = s.Value;
            }
            return Ok(dict);
        }

        [HttpGet("{key}")]
        public async Task<IActionResult> GetSetting(string key)
        {
            var list = await _context.SystemSettings.ToListAsync();
            var setting = list.FirstOrDefault(s => string.Equals(s.Key, key, StringComparison.OrdinalIgnoreCase));
            if (setting == null) return NotFound();
            return Ok(new { key = setting.Key, value = setting.Value });
        }

        [HttpPost]
        public async Task<IActionResult> UpdateSetting([FromBody] SystemSetting model)
        {
            if (string.IsNullOrEmpty(model.Key)) return BadRequest("Key is required.");

            var list = await _context.SystemSettings.ToListAsync();
            var setting = list.FirstOrDefault(s => string.Equals(s.Key, model.Key, StringComparison.OrdinalIgnoreCase));
            if (setting == null)
            {
                _context.SystemSettings.Add(model);
            }
            else
            {
                setting.Value = model.Value;
                _context.SystemSettings.Update(setting);
            }

            await _context.SaveChangesAsync();
            return Ok(new { Status = "Success", Message = "Setting saved successfully!" });
        }

        [HttpPost("bulk")]
        public async Task<IActionResult> UpdateBulkSettings([FromBody] Dictionary<string, string> settings)
        {
            if (settings == null) return BadRequest("Settings cannot be null.");

            var existingList = await _context.SystemSettings.ToListAsync();

            foreach (var kvp in settings)
            {
                var existing = existingList.FirstOrDefault(s => string.Equals(s.Key, kvp.Key, StringComparison.OrdinalIgnoreCase));
                if (existing == null)
                {
                    _context.SystemSettings.Add(new SystemSetting { Key = kvp.Key, Value = kvp.Value ?? string.Empty });
                }
                else
                {
                    existing.Value = kvp.Value ?? string.Empty;
                    _context.SystemSettings.Update(existing);
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { Status = "Success", Message = "Settings updated successfully!" });
        }

        public class TestAiRequest
        {
            public string? Provider { get; set; }
            public string? Endpoint { get; set; }
            public string? ApiKey { get; set; }
            public string? Model { get; set; }
        }

        [HttpPost("test-ai")]
        public async Task<IActionResult> TestAi([FromBody] TestAiRequest req)
        {
            try
            {
                var endpoint = req.Endpoint;
                var apiKey = req.ApiKey;
                var model = req.Model;

                if (string.IsNullOrEmpty(apiKey))
                {
                    apiKey = (await _context.SystemSettings.FindAsync("AI:ApiKey"))?.Value
                             ?? (await _context.SystemSettings.FindAsync("OpenRouter:ApiKey"))?.Value
                             ?? _configuration["OpenRouter:ApiKey"];
                }

                if (string.IsNullOrEmpty(endpoint))
                {
                    endpoint = (await _context.SystemSettings.FindAsync("AI:Endpoint"))?.Value
                               ?? "https://integrate.api.nvidia.com/v1/chat/completions";
                }

                if (string.IsNullOrEmpty(model))
                {
                    model = (await _context.SystemSettings.FindAsync("AI:Model"))?.Value
                            ?? "deepseek-ai/deepseek-r1";
                }

                if (string.IsNullOrEmpty(apiKey))
                {
                    return BadRequest(new { Success = false, Message = "API Key is required to test." });
                }

                endpoint = NormalizeEndpoint(endpoint);

                var client = _httpClientFactory.CreateClient();
                client.Timeout = TimeSpan.FromSeconds(30);

                var request = new HttpRequestMessage(HttpMethod.Post, endpoint);
                request.Headers.Add("Authorization", $"Bearer {apiKey}");

                var payload = new
                {
                    model = model,
                    messages = new[]
                    {
                        new { role = "user", content = "Test connection. Reply in one short sentence: 'AI connection successful!'" }
                    },
                    max_tokens = 60,
                    temperature = 0.6
                };

                request.Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");

                var response = await client.SendAsync(request);
                var jsonString = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    string errorMessage = jsonString;
                    try
                    {
                        using var errDoc = System.Text.Json.JsonDocument.Parse(jsonString);
                        if (errDoc.RootElement.TryGetProperty("error", out var errObj))
                        {
                            if (errObj.ValueKind == System.Text.Json.JsonValueKind.Object && errObj.TryGetProperty("message", out var msg))
                            {
                                errorMessage = msg.GetString() ?? jsonString;
                            }
                            else if (errObj.ValueKind == System.Text.Json.JsonValueKind.String)
                            {
                                errorMessage = errObj.GetString() ?? jsonString;
                            }
                        }
                        else if (errDoc.RootElement.TryGetProperty("message", out var directMsg))
                        {
                            errorMessage = directMsg.GetString() ?? jsonString;
                        }
                    }
                    catch { }

                    return BadRequest(new { Success = false, Status = (int)response.StatusCode, Error = errorMessage });
                }

                using var doc = System.Text.Json.JsonDocument.Parse(jsonString);
                var reply = "";
                if (doc.RootElement.TryGetProperty("choices", out var choices) && choices.GetArrayLength() > 0)
                {
                    var firstChoice = choices[0];
                    if (firstChoice.TryGetProperty("message", out var msg) && msg.TryGetProperty("content", out var c))
                    {
                        reply = c.GetString() ?? "";
                    }
                }

                if (reply.Contains("</think>"))
                {
                    reply = reply.Substring(reply.IndexOf("</think>") + 8).Trim();
                }

                return Ok(new { Success = true, Reply = reply, Model = model });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Success = false, Error = ex.Message });
            }
        }

        private static string NormalizeEndpoint(string endpoint)
        {
            if (string.IsNullOrWhiteSpace(endpoint)) return "https://api.deepseek.com/chat/completions";
            endpoint = endpoint.Trim().TrimEnd('/');
            if (!endpoint.EndsWith("/chat/completions", StringComparison.OrdinalIgnoreCase))
            {
                endpoint += "/chat/completions";
            }
            return endpoint;
        }
    }
}
