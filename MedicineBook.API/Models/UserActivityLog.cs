using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MedicineBook.API.Models
{
    public class UserActivityLog
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; } = string.Empty;

        [ForeignKey("UserId")]
        public ApplicationUser? User { get; set; }

        [Required]
        [MaxLength(100)]
        public string ActionType { get; set; } = string.Empty; // e.g., "Login", "Search", "View_Medicine"

        [MaxLength(500)]
        public string? Details { get; set; } // e.g., "Searched for Paracetamol"

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
