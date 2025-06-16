using API_pokedex_pokemon_card.Models;

public interface IUserService
{
    public Task<User?> GetUserByEmailAsync(string email);
    public Task<bool> CreateAsync(User user);
    public Task<User> UpdateUserAsync(User user);
}