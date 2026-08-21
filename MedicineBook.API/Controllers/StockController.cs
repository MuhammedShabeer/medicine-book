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

        [HttpGet("{medicineId}")]
        public async Task<ActionResult<IEnumerable<MedicineStock>>> GetStock(int medicineId)
        {
            var stock = await _context.MedicineStocks
                .Where(s => s.MedicineId == medicineId)
                .OrderBy(s => s.ExpiryDate)
                .ToListAsync();

            return Ok(stock);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<MedicineStock>> AddStock(MedicineStock stock)
        {
            if (stock.MedicineId <= 0)
                return BadRequest("MedicineId is required");

            stock.LastUpdated = DateTime.UtcNow;
            _context.MedicineStocks.Add(stock);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStock), new { medicineId = stock.MedicineId }, stock);
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

            stock.BatchNumber = updatedStock.BatchNumber;
            stock.ExpiryDate = updatedStock.ExpiryDate;
            stock.Quantity = updatedStock.Quantity;
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

        [HttpPost("bulk/{medicineId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> BulkUpdateStock(int medicineId, [FromBody] List<MedicineStock> stocks)
        {
            var medicine = await _context.Medicines.FindAsync(medicineId);
            if (medicine == null)
                return NotFound("Medicine not found");

            // Remove existing stock for this medicine
            var existingStock = await _context.MedicineStocks.Where(s => s.MedicineId == medicineId).ToListAsync();
            _context.MedicineStocks.RemoveRange(existingStock);

            // Add new stock
            foreach (var stock in stocks)
            {
                stock.MedicineId = medicineId;
                stock.LastUpdated = DateTime.UtcNow;
                _context.MedicineStocks.Add(stock);
            }

            await _context.SaveChangesAsync();
            return Ok(new { Status = "Success", Message = "Stock updated successfully" });
        }
    }
}
