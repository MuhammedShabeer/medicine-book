namespace MedicineBook.API.Models
{
    public class Medicine
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Category { get; set; }
        public string? Description { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string? BatchNumber { get; set; }
        public string? Supplier { get; set; }
    }
}
