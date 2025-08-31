public class PokemonFilterDto
{
    public int? FilterGeneration { get; set; }
    public string? FilterName { get; set; }
    public bool FilterExceptWantedAndOwned { get; set; }
    public bool FilterExceptHasNoWantedCard { get; set; }
    public int PokedexId { get; set; }
}