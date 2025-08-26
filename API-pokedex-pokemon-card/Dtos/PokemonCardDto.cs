public class PokemonCardDto
{
    public string Id { get; set; }
    public string Name { get; set; }   // si tu as ce champ
    public string Image { get; set; }  // URL complète
    public required string CardId { get; set; }
    public required int PokemonId { get; set; }
}

public class OwnedPokemonCardDto
{
    public int Id { get; set; }
    public int PokedexId { get; set; }
    public string PokemonCardId { get; set; }
    public int PokemonId { get; set; }
    public DateOnly AcquiredDate { get; set; }
    public decimal? Price { get; set; }
    public decimal? AcquiredPrice { get; set; }
    public PokemonCardDto PokemonCard { get; set; }
}

public class SetCardRequest
{
    public string CardId { get; set; }
    public int PokemonId { get; set; }
}