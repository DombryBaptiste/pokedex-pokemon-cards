public class CardPrinting
{
    public int Id { get; set; }
    public required string PokemonCardId { get; set; }
    public PokemonCard PokemonCard { get; set; } = null!;

    public PrintingType Type { get; set; }
}

public enum PrintingType
{
    Normal = 0,
    Reverse = 1,
    NonHolo = 2,
    HoloCosmo = 3,
    HoloCrackedIce = 4,
    TamponLeague = 5
}