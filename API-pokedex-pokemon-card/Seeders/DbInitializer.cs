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

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        var setsFromFile = JsonSerializer.Deserialize<List<Sets>>(json, options);

        if (setsFromFile == null)
        {
            Console.WriteLine("Échec du parsing JSON.");
            return;
        }

        var existingById = context.Sets.ToDictionary(s => s.SetId);
        var toInsert = new List<Sets>();
        var updatedCount = 0;

        foreach (var incoming in setsFromFile)
        {
            if (existingById.TryGetValue(incoming.SetId, out var existing))
            {
                var entry = context.Entry(existing);

                entry.CurrentValues.SetValues(new
                {
                    incoming.Name,
                    incoming.ReleaseDate,
                    incoming.CardMarketPrefix
                });

                
                if (entry.Properties.Any(p => p.IsModified))
                    updatedCount++;
            }
            else
            {
                toInsert.Add(incoming);
            }
        }

        if (toInsert.Count > 0)
            context.Sets.AddRange(toInsert);

        if (updatedCount > 0 || toInsert.Count > 0)
        {
            context.SaveChanges();
            Console.WriteLine($"{toInsert.Count} inséré(s), {updatedCount} mis à jour.");
        }
        else
        {
            Console.WriteLine("Aucun changement à appliquer.");
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
