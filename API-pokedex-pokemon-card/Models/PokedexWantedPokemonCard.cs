using API_pokedex_pokemon_card.Models;

public class PokedexWantedPokemonCard
{
    public int Id { get; set; }

    public int PokedexId { get; set; }
    public Pokedex Pokedex { get; set; }

    public required string PokemonCardId { get; set; }
    public PokemonCard PokemonCard { get; set; }

    public required int PokemonId { get; set; }
    public Pokemon Pokemon { get; set; }

    public DateTime AddedDate { get; set; }

    public string? Notes { get; set; }
}
