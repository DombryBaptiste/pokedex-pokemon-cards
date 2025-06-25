using API_pokedex_pokemon_card.Models;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public DbSet<PokemonCard> PokemonCards { get; set; }
    public DbSet<Pokemon> Pokemons { get; set; }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        var connectionString = "server=localhost;port=3306;database=pokedex-pokemon-db;user=root;password=qBZc9KLhynJWLKGu8clK";
        optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
    }
}