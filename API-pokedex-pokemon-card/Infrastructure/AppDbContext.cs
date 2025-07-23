
using API_pokedex_pokemon_card.Models;
using Microsoft.EntityFrameworkCore;

namespace API_pokedex_pokemon_card.Infrastructure;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    { }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker.Entries<AuditableEntity>();

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedDate = DateTime.UtcNow;
                entry.Entity.UpdatedDate = DateTime.UtcNow;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedDate = DateTime.UtcNow;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }

    public DbSet<Pokemon> Pokemons { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<PokemonCard> PokemonCards { get; set; }
    public DbSet<Pokedex> Pokedexs { get; set; }
    public DbSet<PokedexOwnedPokemonCard> PokedexOwnedPokemonCards { get; set; }
    public DbSet<PokedexWantedPokemonCard> PokedexWantedPokemonCards { get; set; }
    public DbSet<PokedexUser> PokedexUsers { get; set; }
    public DbSet<PokedexValuationHistory> PokedexValuationHistory { get; set; }
    public DbSet<Sets> Sets { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<PokedexUser>()
            .HasKey(pu => new { pu.UserId, pu.PokedexId });

        modelBuilder.Entity<PokedexUser>()
            .HasOne(pu => pu.User)
            .WithMany(u => u.PokedexUsers)
            .HasForeignKey(pu => pu.UserId);

        modelBuilder.Entity<PokedexUser>()
            .HasOne(pu => pu.Pokedex)
            .WithMany(p => p.PokedexUsers)
            .HasForeignKey(pu => pu.PokedexId);
    }

}