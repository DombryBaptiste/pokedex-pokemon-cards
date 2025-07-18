using API_pokedex_pokemon_card.Models;

public class PokedexOwnedPokemonCard
{
    public int Id { get; set; }

    public int PokedexId { get; set; }
    public Pokedex Pokedex { get; set; }

    public required string PokemonCardId { get; set; }
    public PokemonCard PokemonCard { get; set; }

    public required int PokemonId { get; set; }
    public Pokemon Pokemon { get; set; }

    public float Price { get; set; }
    public float AcquiredPrice { get; set; }

    public DateTime AcquiredDate { get; set; }
}
