namespace API_pokedex_pokemon_card.Models;

public class User : AuditableEntity
{
    public int Id { get; set; }
    public required string Email { get; set; }
    public required DateTime LastLoggedIn { get; set; }
    public required string PictureProfilPath { get; set; }
    public string? Pseudo { get; set; }
    public List<int>? HiddenPokemonIds { get; set; }
}