using System.Text.Json;
using API_pokedex_pokemon_card.Infrastructure;
using API_pokedex_pokemon_card.Models;

public static class DbInitializer
{
    private static readonly JsonSerializerOptions options = new JsonSerializerOptions
    {
        PropertyNameCaseInsensitive = true
    };

    public static void Seed(AppDbContext context)
    {
        SeedSets(context);
        SeedPokemons(context);
    }

    private static void SeedPokemons(AppDbContext context)
    {
        var jsonFilePath = Path.Combine("Assets", "pokemons.json");
        var json = ReadFile(jsonFilePath);

        var pokemonsFromFile = JsonSerializer.Deserialize<List<Pokemon>>(json, options);

        if (pokemonsFromFile == null)
        {
            Console.WriteLine("Échec du parsing JSON.");
            return;
        }

        var existingById = context.Pokemons.ToDictionary(s => s.Id);
        var toInsert = new List<Pokemon>();
        var updatedCount = 0;

        foreach (var incoming in pokemonsFromFile)
        {
            if (existingById.TryGetValue(incoming.Id, out var existing))
            {
                var entry = context.Entry(existing);

                entry.CurrentValues.SetValues(new
                {
                    incoming.PokedexId,
                    incoming.Name,
                    incoming.Generation,
                    incoming.ImagePath,
                    incoming.PreviousPokemonId,
                    incoming.NextPokemonId
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
            context.Pokemons.AddRange(toInsert);

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

    private static void SeedSets(AppDbContext context)
    {
        var jsonFilePath = Path.Combine("Assets", "sets.json");
        var json = ReadFile(jsonFilePath);

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
