using API_pokedex_pokemon_card.Models;

public class Pokedex
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string ShareCode { get; set; }
     public List<PokedexUser> PokedexUsers { get; set; } = new();
    public List<PokedexOwnedPokemonCard> OwnedPokemonCards { get; set; } = new();
    public List<PokedexWantedPokemonCard> WantedPokemonCards { get; set; } = new();
}