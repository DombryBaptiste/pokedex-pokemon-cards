public class PokedexSpecificPokemon
{
    public int Id { get; set; }
    public int PokedexId { get; set; }
    public int Slot { get; set; }

    public int PokemonId { get; set; }
    public Pokedex Pokedex { get; set; } = null!;
}