using API_pokedex_pokemon_card.Models;

public class Pokedex
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string ShareCode { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    public List<PokedexOwnedPokemonCard> OwnedPokemonCards { get; set; } = new();
    public List<PokedexWantedPokemonCard> WantedPokemonCards { get; set; } = new();
}