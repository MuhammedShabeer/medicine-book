using System.Text.Json.Serialization;

namespace MedicineBook.API.Models
{
    public class MedicineFile
    {
        public int Id { get; set; }
        public int MedicineId { get; set; }
        public required string FileName { get; set; }
        public required string FilePath { get; set; }
        public required string ContentType { get; set; }
        public long FileSize { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public Medicine? Medicine { get; set; }
    }
}
