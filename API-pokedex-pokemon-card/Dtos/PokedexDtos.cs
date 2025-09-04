public class PokedexCreateDto
{
    public required string Name { get; set; }
    public required int UserId { get; set; }
    public required PokedexType Type { get; set; }
}

public class PokedexCreateCodeDto
{
    public required string ShareCode { get; set; }
    public required int UserId { get; set; }
}

public class PokedexCompletionDto
{
    public required int UserId { get; set; }
}

public class PokedexSpecificPokemonSetDto
{
    public required int PokemonId { get; set; }
}