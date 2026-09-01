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

        public SettingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{key}")]
        public async Task<IActionResult> GetSetting(string key)
        {
            var setting = await _context.SystemSettings.FindAsync(key);
            if (setting == null) return NotFound();
            return Ok(new { key = setting.Key, value = setting.Value });
        }

        [HttpPost]
        public async Task<IActionResult> UpdateSetting([FromBody] SystemSetting model)
        {
            if (string.IsNullOrEmpty(model.Key)) return BadRequest("Key is required.");

            var setting = await _context.SystemSettings.FindAsync(model.Key);
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
    }
}
