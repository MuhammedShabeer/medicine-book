using System;
using System.ComponentModel.DataAnnotations;

namespace MedicineBook.API.Models
{
    public class Announcement
    {
        public int Id { get; set; }
        
        [Required]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Content { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public string? CreatedBy { get; set; }
        
        public string? AttachmentName { get; set; }
        public string? AttachmentPath { get; set; }
    }
}
