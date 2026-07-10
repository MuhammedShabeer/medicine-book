namespace MedicineBook.API.Models.DTOs
{
    public class RegisterDto
    {
        public string? FullName { get; set; }
        public required string Username { get; set; }
        public required string Password { get; set; }
        public string Role { get; set; } = "Staff"; // Default role
    }
}
