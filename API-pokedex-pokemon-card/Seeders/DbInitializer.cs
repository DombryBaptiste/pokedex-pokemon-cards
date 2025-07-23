using System.Text.Json;
using API_pokedex_pokemon_card.Infrastructure;
using API_pokedex_pokemon_card.Models;

public static class DbInitializer
{
    public static void Seed(AppDbContext context)
    {
        var jsonFilePath = Path.Combine("Assets", "pokemons.json");

        if (!File.Exists(jsonFilePath))
        {
            Console.WriteLine($"Le fichier {jsonFilePath} est introuvable.");
            return;
        }

        var json = File.ReadAllText(jsonFilePath);
        var pokemonsFromFile = JsonSerializer.Deserialize<List<Pokemon>>(json);

        if (pokemonsFromFile == null)
        {
            Console.WriteLine("Échec du parsing JSON.");
            return;
        }

        var existingIds = context.Pokemons.Select(p => p.Id).ToHashSet();

        var newPokemons = pokemonsFromFile
            .Where(p => !existingIds.Contains(p.Id))
            .ToList();

        if (newPokemons.Any())
        {
            context.Pokemons.AddRange(newPokemons);
            context.SaveChanges();
            Console.WriteLine($"{newPokemons.Count} nouveau(x) Pokémon ajouté(s).");
        }
        else
        {
            Console.WriteLine("Aucun nouveau Pokémon à ajouter.");
        }
    }
}
