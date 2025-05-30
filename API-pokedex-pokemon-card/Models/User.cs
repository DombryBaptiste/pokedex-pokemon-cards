namespace API_pokedex_pokemon_card.Models;

public class User : AuditableEntity
{
    public int Id { get; set; }
    public required string Email { get; set; }
    public required DateTime LastLoggedIn { get; set; }
}