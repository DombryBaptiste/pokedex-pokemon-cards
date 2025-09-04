public class CardPrintingDto
{
    public int Id { get; set; }
    public required string PokemonCardId { get; set; }
    public PrintingType Type { get; set; }
}