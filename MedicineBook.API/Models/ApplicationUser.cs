using Microsoft.AspNetCore.Identity;

namespace MedicineBook.API.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? FullName { get; set; }
    }
}
