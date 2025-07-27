using API_pokedex_pokemon_card.Models;

public class PokemonCardPokemon
{
    public string PokemonCardId { get; set; }
    public PokemonCard PokemonCard { get; set; }

    public int PokemonId { get; set; }
    public Pokemon Pokemon { get; set; }
}
