using System.ComponentModel.DataAnnotations.Schema;

namespace API_pokedex_pokemon_card.Models;

public class Pokemon
{
    public int Id { get; set; }
    public required int PokedexId { get; set; }
    public required string Name { get; set; }
    public required int Generation { get; set; }
    public required string ImagePath { get; set; }
    public List<PokemonCardPokemon> PokemonCardPokemons { get; set; } = new();
    List<PokedexWantedPokemonCard> PokedexWantedPokemonCards { get; set; } = new List<PokedexWantedPokemonCard>();
    List<PokedexOwnedPokemonCard> PokedexOwnedPokemonCard { get; set; } = new List<PokedexOwnedPokemonCard>();
    public int? PreviousPokemonId { get; set; }
    public int? NextPokemonId { get; set; }

    // NON MAPPE
    [NotMapped]
    public bool IsWantedAndOwned { get; set; }
    [NotMapped]
    public List<PokemonCard> PokemonCards { get; set; } = new();
}