using API_pokedex_pokemon_card.Models;

public class PokedexUser
{
    public int PokedexId { get; set; }
    public Pokedex Pokedex { get; set; }

    public int UserId { get; set; }
    public User User { get; set; }

    public bool IsOwner { get; set; }
}
