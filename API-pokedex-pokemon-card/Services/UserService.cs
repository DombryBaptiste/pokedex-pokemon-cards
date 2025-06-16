using API_pokedex_pokemon_card.Infrastructure;
using API_pokedex_pokemon_card.Models;
using Microsoft.EntityFrameworkCore;

public class UserService : IUserService
{
    private readonly AppDbContext _context;
    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<bool> CreateAsync(User user)
    {
        try
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<User> UpdateUserAsync(User user)
    {
        var modifiedUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == user.Id);
        if (modifiedUser == null)
        {
            throw new KeyNotFoundException($"L'utilisateur d'id : {user.Id} est introuvable.");
        }

        var props = typeof(User).GetProperties();
        foreach (var prop in props)
        {
            var newValue = prop.GetValue(user);
            if (newValue != null)
                prop.SetValue(modifiedUser, newValue);
        }

        await _context.SaveChangesAsync();
        return modifiedUser;
    }
}