
using API_pokedex_pokemon_card.Models;
using Microsoft.EntityFrameworkCore;

namespace API_pokedex_pokemon_card.Infrastructure;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    { }
    
}