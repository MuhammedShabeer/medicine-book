using System.Text.Json.Serialization;

namespace MedicineBook.API.Models
{
    public class MedicineStock
    {
        public int Id { get; set; }
        public int MedicineId { get; set; }
        
        public required string BatchNumber { get; set; }
        public DateTime ExpiryDate { get; set; }
        public int Quantity { get; set; }
        public string? Notes { get; set; }
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public Medicine? Medicine { get; set; }
    }
}
