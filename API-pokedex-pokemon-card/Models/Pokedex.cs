using API_pokedex_pokemon_card.Models;

public class Pokedex
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string ShareCode { get; set; }
    public required PokedexType Type { get; set; }
    public List<PokedexUser> PokedexUsers { get; set; } = new();
    public List<PokedexOwnedPokemonCard> OwnedPokemonCards { get; set; } = new();
    public List<PokedexWantedPokemonCard> WantedPokemonCards { get; set; } = new();
    public List<PokedexSpecificPokemon> SpecificPokemons { get; set; } = new();
}

public class PokedexCompletion
{
    public int PokedexId { get; set; }
    public int MaxPokemon { get; set; }
    public int OwnedPokemonNb { get; set; }
}


public readonly record struct Pair(int PokemonId, string PokemonCardId);

public class PokedexCompletionData
{
    public PokedexType Type { get; set; }
    public IReadOnlyList<Pair> WantedPairs { get; set; } = [];
    public IReadOnlyList<Pair> OwnedPairs { get; set; } = [];
}

public enum PokedexType
{
    LivingDex,
    SpecificPokemonsDex,
    ZarbiDex
}