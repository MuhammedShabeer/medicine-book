using CsvHelper;
using ClosedXML.Excel;
using MedicineBook.API.Data;
using MedicineBook.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace MedicineBook.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MedicinesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MedicinesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Medicine>>> GetMedicines([FromQuery] int page = 1, [FromQuery] int pageSize = 50, [FromQuery] string search = "")
        {
            var query = _context.Medicines.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(m => m.Name.Contains(search) || (m.Category != null && m.Category.Contains(search)));
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
