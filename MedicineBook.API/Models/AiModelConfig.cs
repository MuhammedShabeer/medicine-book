namespace MedicineBook.API.Models
{
    public class AiModelConfig
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; } = string.Empty;
        public string Tier { get; set; } = "Paid"; // "Paid", "Free", "Fallback"
        public string Provider { get; set; } = "nvidia"; // "nvidia", "openrouter", "groq", "custom"
        public string Endpoint { get; set; } = "https://integrate.api.nvidia.com/v1/chat/completions";
        public string ApiKey { get; set; } = string.Empty;
        public string Model { get; set; } = "deepseek-ai/deepseek-r1";
        public bool IsActive { get; set; } = true;
        public int Priority { get; set; } = 1;
    }
}
