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
        public async Task<ActionResult<Announcement>> CreateAnnouncement([FromBody] Announcement announcement)
        {
            if (string.IsNullOrWhiteSpace(announcement.Title) || string.IsNullOrWhiteSpace(announcement.Content))
                return BadRequest("Title and Content are required.");

            var fullName = User.FindFirst(ClaimTypes.GivenName)?.Value;
            if (string.IsNullOrEmpty(fullName))
                fullName = User.FindFirst(ClaimTypes.Name)?.Value ?? "Admin";
            
            announcement.CreatedBy = fullName;
            announcement.CreatedAt = DateTime.UtcNow;

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

            _context.Announcements.Remove(announcement);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
