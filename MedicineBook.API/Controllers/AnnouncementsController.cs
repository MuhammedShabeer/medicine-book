using MedicineBook.API.Data;
using MedicineBook.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MedicineBook.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AnnouncementsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AnnouncementsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Announcement>>> GetAnnouncements()
        {
            var announcements = await _context.Announcements
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();

            return Ok(announcements);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Announcement>> CreateAnnouncement([FromForm] string title, [FromForm] string content, [FromForm] IFormFile? attachment)
        {
            if (string.IsNullOrWhiteSpace(title) || string.IsNullOrWhiteSpace(content))
                return BadRequest("Title and Content are required.");

            var fullName = User.FindFirst(ClaimTypes.GivenName)?.Value;
            if (string.IsNullOrEmpty(fullName))
                fullName = User.FindFirst(ClaimTypes.Name)?.Value ?? "Admin";
            
            var announcement = new Announcement 
            {
                Title = title,
                Content = content,
                CreatedBy = fullName,
                CreatedAt = DateTime.UtcNow
            };

            if (attachment != null && attachment.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "announcements");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(attachment.FileName).Replace(" ", "_");
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await attachment.CopyToAsync(stream);
                }

                announcement.AttachmentName = attachment.FileName;
                announcement.AttachmentPath = $"/uploads/announcements/{uniqueFileName}";
            }

            _context.Announcements.Add(announcement);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAnnouncements), new { id = announcement.Id }, announcement);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAnnouncement(int id)
        {
            var announcement = await _context.Announcements.FindAsync(id);
            if (announcement == null) return NotFound();

            if (!string.IsNullOrEmpty(announcement.AttachmentPath))
            {
                var physicalPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", announcement.AttachmentPath.TrimStart('/'));
                if (System.IO.File.Exists(physicalPath))
                {
                    System.IO.File.Delete(physicalPath);
                }
            }

            _context.Announcements.Remove(announcement);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
