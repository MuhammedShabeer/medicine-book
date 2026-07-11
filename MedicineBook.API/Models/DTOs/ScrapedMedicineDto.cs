namespace MedicineBook.API.Models.DTOs
{
    public class ScrapedMedicineDto
    {
        public required string Title { get; set; }
        public string? Description { get; set; }
        public string? Price { get; set; }
        public string? ImageUrl { get; set; }
        public string? ProductUrl { get; set; }
    }

    public class WikipediaDto
    {
        public string? Summary { get; set; }
        public string? Url { get; set; }
    }

    public class DuckDuckGoDto
    {
        public string? Snippet { get; set; }
        public string? Url { get; set; }
    }

    public class OpenFdaDto
    {
        public string? ActiveIngredient { get; set; }
        public string? Purpose { get; set; }
        public string? Warnings { get; set; }
        public string? IndicationsAndUsage { get; set; }
    }

    public class AggregatedScrapeResultDto
    {
        public List<ScrapedMedicineDto> Wellcare { get; set; } = new();
        public WikipediaDto? Wikipedia { get; set; }
        public DuckDuckGoDto? DuckDuckGo { get; set; }
        public OpenFdaDto? OpenFda { get; set; }
    }
}
