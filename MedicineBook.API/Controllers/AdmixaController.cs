using MedicineBook.API.Data;
using MedicineBook.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace MedicineBook.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdmixaController : ControllerBase
    {
        private const string AdmixaDrugsKey = "Admixa_Drugs";
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public AdmixaController(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        [HttpGet("drugs")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDrugs()
        {
            var setting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.Key == AdmixaDrugsKey);
            if (setting == null || string.IsNullOrWhiteSpace(setting.Value))
            {
                return Ok(null);
            }

            try
            {
                var jsonDoc = JsonDocument.Parse(setting.Value);
                return Ok(jsonDoc.RootElement);
            }
            catch
            {
                return Content(setting.Value, "application/json");
            }
        }

        [HttpPost("drugs")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SaveDrugs([FromBody] JsonElement drugsJson)
        {
            var rawJson = drugsJson.GetRawText();
            var setting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.Key == AdmixaDrugsKey);
            if (setting == null)
            {
                _context.SystemSettings.Add(new SystemSetting { Key = AdmixaDrugsKey, Value = rawJson });
            }
            else
            {
                setting.Value = rawJson;
                _context.SystemSettings.Update(setting);
            }

            await _context.SaveChangesAsync();
            return Ok(new { status = "Success", message = "Admixa drugs updated successfully." });
        }

        [HttpPost("upload-photo")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadPhoto(IFormFile file, [FromForm] string? drugId)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
            if (!allowed.Contains(ext))
                return BadRequest("Invalid image format. Allowed: JPG, PNG, WEBP, GIF.");

            var webRoot = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var uploadsFolder = Path.Combine(webRoot, "uploads", "admixa");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var cleanDrugId = string.IsNullOrWhiteSpace(drugId) ? "photo" : drugId.Trim().ToLowerInvariant().Replace(" ", "-");
            var uniqueName = $"{cleanDrugId}_{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}_{Guid.NewGuid().ToString("N")[..6]}{ext}";
            var filePath = Path.Combine(uploadsFolder, uniqueName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var relativeUrl = $"/uploads/admixa/{uniqueName}";
            return Ok(new
            {
                id = "p_" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                url = relativeUrl,
                fileName = uniqueName
            });
        }

        [HttpDelete("photos")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeletePhoto([FromQuery] string url)
        {
            if (string.IsNullOrWhiteSpace(url)) return BadRequest("Url is required.");

            try
            {
                var fileName = Path.GetFileName(url);
                var webRoot = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var filePath = Path.Combine(webRoot, "uploads", "admixa", fileName);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
                return Ok(new { status = "Success", message = "Photo deleted." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
