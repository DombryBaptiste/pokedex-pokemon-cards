public class PokemonCardDto
{
    public required string Id { get; set; }
    public required string Name { get; set; }   // si tu as ce champ
    public required string Image { get; set; }  // URL complète
    public required string CardId { get; set; }
    public required int PokemonId { get; set; }
     public ICollection<CardPrintingDto> CardPrintings { get; set; } = new List<CardPrintingDto>();
}

public class OwnedPokemonCardDto
{
    public int Id { get; set; }
    public int PokedexId { get; set; }
    public required string PokemonCardId { get; set; }
    public int PokemonId { get; set; }
    public DateOnly AcquiredDate { get; set; }
    public decimal? Price { get; set; }
    public decimal? AcquiredPrice { get; set; }
    public PokemonCardDto? PokemonCard { get; set; }
    public PrintingType? PrintingType { get; set; }
}

public class SetCardRequest
{
    public required string CardId { get; set; }
    public int PokemonId { get; set; }
    public PrintingType? Type { get; set; }
}

public class SetCardTypeRequest
{
    public required PrintingType Type { get; set; }
    public required bool isDelete { get; set; }
}