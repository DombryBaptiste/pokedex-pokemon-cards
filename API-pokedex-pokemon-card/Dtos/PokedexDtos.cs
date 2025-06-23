public class PokedexCreateDto
{
    public required string Name { get; set; }
    public required int UserId { get; set; }
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