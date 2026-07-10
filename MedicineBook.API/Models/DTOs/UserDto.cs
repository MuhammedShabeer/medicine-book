namespace MedicineBook.API.Models.DTOs
{
    public class UserDto
    {
        public string Id { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public IList<string> Roles { get; set; } = new List<string>();
    }
}
