using System.Text.Json;
using API_pokedex_pokemon_card.Infrastructure;
using API_pokedex_pokemon_card.Models;

public static class DbInitializer
{
    public static void Seed(AppDbContext context)
    {
        SeedSets(context);
        SeedPokemons(context);
    }

    private static void SeedPokemons(AppDbContext context)
    {
        var jsonFilePath = Path.Combine("Assets", "pokemons.json");
        var json = ReadFile(jsonFilePath);
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

    private static void SeedSets(AppDbContext context)
    {
        var jsonFilePath = Path.Combine("Assets", "sets.json");
        var json = ReadFile(jsonFilePath);
        var setsFromFile = JsonSerializer.Deserialize<List<Sets>>(json);

        if (setsFromFile == null)
        {
            Console.WriteLine("Échec du parsing JSON.");
            return;
        }

        var existingSetId = context.Sets.Select(s => s.Id).ToList();
        var newSet = setsFromFile
            .Where(p => !existingSetId.Contains(p.Id))
            .ToList();

        if (newSet.Any())
        {
            context.Sets.AddRange(newSet);
            context.SaveChanges();
            Console.WriteLine($"{newSet.Count} nouveau(x) Sets ajouté(s).");
        }
        else
        {
            Console.WriteLine("Aucun nouveau Sets à ajouter.");
        }
    }

    private static string ReadFile(string path)
    {

        if (!File.Exists(path))
        {
            Console.WriteLine($"Le fichier {path} est introuvable.");
            return "";
        }
        return File.ReadAllText(path);
    }
}
