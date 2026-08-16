using MedicineBook.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MedicineBook.API.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // We will add DbSet for Medicine here later
        public DbSet<Medicine> Medicines { get; set; }
        public DbSet<MedicineFile> MedicineFiles { get; set; }
        public DbSet<UserActivityLog> UserActivityLogs { get; set; }
    }
}
