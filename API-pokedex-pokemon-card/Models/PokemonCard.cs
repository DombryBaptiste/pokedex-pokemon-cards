using System.ComponentModel.DataAnnotations.Schema;
using API_pokedex_pokemon_card.Models;

public class PokemonCard
{
    public required string Id { get; set; }
    public required string LocalId { get; set; }
    public required string Extension { get; set; }
    public required string Name { get; set; }
    public required string Image { get; set; }
    public List<PokemonCardPokemon> PokemonCardPokemons { get; set; } = new();
    public Sets Set { get; set; }
    public int SetId { get; set; }

    [NotMapped]
    public int PokemonId { get; set; }

}

public enum PokemonCardTypeSelected
{
    Owned,
    Wanted
}