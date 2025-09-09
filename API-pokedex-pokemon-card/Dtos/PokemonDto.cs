public class PokemonDto
{
    public int Id { get; set; }
    public required int PokedexId { get; set; }
    public required string Name { get; set; }
    public required int Generation { get; set; }
    public required string ImagePath { get; set; }
    public int? PreviousPokemonId { get; set; }
    public int? NextPokemonId { get; set; }
    public List<PokemonCardDto> PokemonCards { get; set; } = new();
}