namespace MedicineBook.API.Models.DTOs
{
    public class UpdateUserDto
    {
        public string? FullName { get; set; }
        public string? Password { get; set; } // Optional: Leave empty to not change
        public required string Role { get; set; }
    }
}
