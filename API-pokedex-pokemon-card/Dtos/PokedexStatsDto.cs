public class PokedexStatsDto
{
    public string Title { get; set; }
    public List<PokedexValuationHistory> PokedexValuationHistory { get; set; } = [];
    public float AcquiredPriceTotal;
}