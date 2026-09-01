using MedicineBook.API.Data;
using MedicineBook.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MedicineBook.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PreparationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public PreparationsController(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActiveBook()
        {
            var pathSetting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.Key == "Preparations:ActivePdfPath");
            var nameSetting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.Key == "Preparations:ActivePdfName");

            var activePath = pathSetting?.Value;
            var activeName = nameSetting?.Value ?? "Extemporaneous Preparations Book.pdf";

            // If not set, check if any PDF exists in uploads/preparations
            var uploadsFolder = Path.Combine(_environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads", "preparations");
            if (string.IsNullOrEmpty(activePath) && Directory.Exists(uploadsFolder))
            {
                var files = Directory.GetFiles(uploadsFolder, "*.pdf");
                if (files.Length > 0)
                {
                    var fileInfo = new FileInfo(files[0]);
                    activePath = $"/uploads/preparations/{fileInfo.Name}";
                    activeName = fileInfo.Name;
                }
            }

            return Ok(new
            {
                ActivePdfPath = activePath,
                ActivePdfName = activeName
            });
        }

        [HttpGet("list")]
        public IActionResult GetPreparationsList()
        {
            var uploadsFolder = Path.Combine(_environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads", "preparations");
            if (!Directory.Exists(uploadsFolder))
            {
                return Ok(new List<object>());
            }

            var files = Directory.GetFiles(uploadsFolder, "*.pdf")
                .Select(f => new FileInfo(f))
                .OrderByDescending(f => f.LastWriteTimeUtc)
                .Select(f => new
                {
                    FileName = f.Name,
                    Path = $"/uploads/preparations/{f.Name}",
                    Size = f.Length,
                    UploadedAt = f.LastWriteTimeUtc
                })
                .ToList();

            return Ok(files);
        }

        [HttpPost("upload")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadPreparationPdf([FromForm] IFormFile file, [FromForm] string? title)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { Message = "Please select a valid PDF file." });

            if (!file.FileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
                return BadRequest(new { Message = "Only PDF files are supported." });

            var webRoot = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var uploadsFolder = Path.Combine(webRoot, "uploads", "preparations");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var sanitizedName = Path.GetFileName(file.FileName).Replace(" ", "_");
            var uniqueName = $"{Guid.NewGuid().ToString().Substring(0, 8)}_{sanitizedName}";
            var filePath = Path.Combine(uploadsFolder, uniqueName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var relativePath = $"/uploads/preparations/{uniqueName}";
            var displayName = !string.IsNullOrWhiteSpace(title) ? title : file.FileName;

            // Set as active book in SystemSettings
            var pathSetting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.Key == "Preparations:ActivePdfPath");
            if (pathSetting == null)
            {
                _context.SystemSettings.Add(new SystemSetting { Key = "Preparations:ActivePdfPath", Value = relativePath });
            }
            else
            {
                pathSetting.Value = relativePath;
                _context.SystemSettings.Update(pathSetting);
            }

            var nameSetting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.Key == "Preparations:ActivePdfName");
            if (nameSetting == null)
            {
                _context.SystemSettings.Add(new SystemSetting { Key = "Preparations:ActivePdfName", Value = displayName });
            }
            else
            {
                nameSetting.Value = displayName;
                _context.SystemSettings.Update(nameSetting);
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Status = "Success",
                Message = "Extemporaneous Preparation PDF uploaded and set as active book!",
                ActivePdfPath = relativePath,
                ActivePdfName = displayName
            });
        }

        [HttpPost("set-active")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SetActiveBook([FromBody] SetActiveRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Path)) return BadRequest("Path is required.");

            var pathSetting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.Key == "Preparations:ActivePdfPath");
            if (pathSetting == null)
            {
                _context.SystemSettings.Add(new SystemSetting { Key = "Preparations:ActivePdfPath", Value = req.Path });
            }
            else
            {
                pathSetting.Value = req.Path;
                _context.SystemSettings.Update(pathSetting);
            }

            if (!string.IsNullOrWhiteSpace(req.Name))
            {
                var nameSetting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.Key == "Preparations:ActivePdfName");
                if (nameSetting == null)
                {
                    _context.SystemSettings.Add(new SystemSetting { Key = "Preparations:ActivePdfName", Value = req.Name });
                }
                else
                {
                    nameSetting.Value = req.Name;
                    _context.SystemSettings.Update(nameSetting);
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { Status = "Success", Message = "Active preparation book updated!" });
        }

        [HttpDelete("{fileName}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteBook(string fileName)
        {
            var webRoot = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var filePath = Path.Combine(webRoot, "uploads", "preparations", fileName);

            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }

            return Ok(new { Status = "Success", Message = "Document deleted successfully." });
        }

        public class SetActiveRequest
        {
            public string Path { get; set; } = string.Empty;
            public string? Name { get; set; }
        }
    }
}
