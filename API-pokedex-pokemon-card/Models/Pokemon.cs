namespace API_pokedex_pokemon_card.Models;

public class Pokemon
{
    public int Id { get; set; }
    public required int PokedexId { get; set; }
    public required string Name { get; set; }
    public required int Generation { get; set; }
    public required string ImagePath { get; set; }
    public List<PokemonCard> PokemonCards { get; set; } = new List<PokemonCard>();
    List<PokedexWantedPokemonCard> PokedexWantedPokemonCards { get; set; } = new List<PokedexWantedPokemonCard>();
    List<PokedexOwnedPokemonCard> PokedexOwnedPokemonCard { get; set; } = new List<PokedexOwnedPokemonCard>();
}