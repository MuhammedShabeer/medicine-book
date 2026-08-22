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
    public class StockController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StockController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicineStock>>> GetAllStock()
        {
            var stock = await _context.MedicineStocks
                .OrderBy(s => s.MedicineName)
                .ThenBy(s => s.ExpiryDate)
                .ToListAsync();

            return Ok(stock);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<MedicineStock>> AddStock(MedicineStock stock)
        {
            if (string.IsNullOrWhiteSpace(stock.MedicineName))
                return BadRequest("MedicineName is required");

            stock.LastUpdated = DateTime.UtcNow;
            _context.MedicineStocks.Add(stock);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllStock), new { id = stock.Id }, stock);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStock(int id, MedicineStock updatedStock)
        {
            if (id != updatedStock.Id)
                return BadRequest();

            var stock = await _context.MedicineStocks.FindAsync(id);
            if (stock == null)
                return NotFound();

            stock.MedicineName = updatedStock.MedicineName;
            stock.BatchNumber = updatedStock.BatchNumber;
            stock.ExpiryDate = updatedStock.ExpiryDate;
            stock.Quantity = updatedStock.Quantity;
            stock.Branch = updatedStock.Branch;
            stock.Notes = updatedStock.Notes;
            stock.LastUpdated = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteStock(int id)
        {
            var stock = await _context.MedicineStocks.FindAsync(id);
            if (stock == null)
                return NotFound();

            _context.MedicineStocks.Remove(stock);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("bulk-all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> BulkUpdateAllStock([FromBody] List<MedicineStock> stocks)
        {
            // Remove all existing stock to do a complete replacement
            var existingStock = await _context.MedicineStocks.ToListAsync();
            _context.MedicineStocks.RemoveRange(existingStock);

            // Add new stock
            foreach (var stock in stocks)
            {
                if (string.IsNullOrWhiteSpace(stock.MedicineName)) continue;
                stock.Id = 0; // Ensure EF treats it as new
                stock.LastUpdated = DateTime.UtcNow;
                _context.MedicineStocks.Add(stock);
            }

            await _context.SaveChangesAsync();
            return Ok(new { Status = "Success", Message = "All stock updated successfully" });
        }
    }
}
