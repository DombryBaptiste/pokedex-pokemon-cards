using System;
using System.Net.Http;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

class Program
{
    static async Task Main(string[] args)
    {
        if (args.Length == 0)
        {
            Console.WriteLine("Usage : dotnet run -- <generation_id>");
            return;
        }

        int genId = int.Parse(args[0]);
        // string url = $"https://api.tcgdex.net/v2/fr/cards?name={Uri.EscapeDataString(pokemonName)}";

        using var client = new HttpClient();

        try
        {
            using var db = new AppDbContext();
            db.Database.EnsureCreated();

            var pokemonList = await db.Pokemons.Where(p => p.Generation == genId).ToListAsync();
            // var pokemonList = await db.Pokemons.Where(p => EF.Functions.Like(p.Name, "%Arcanin%")).ToListAsync();

            var imageDirectory = Path.Combine(@"C:\Users\pc\Desktop\Repos\pokedex-pokemon-cards\API-pokedex-pokemon-card\Assets", "images");
            Directory.CreateDirectory(imageDirectory);

            foreach (var pokemon in pokemonList)
            {
                Console.WriteLine($"Appel de l'API pour Pokémon : {pokemon.Name}");

                var data = await GetPokemonData(pokemon.Name, client);

                if (data == null || data.Count == 0)
                {
                    Console.WriteLine("Aucune carte trouvée.");
                    continue;
                }

                Console.WriteLine($"\nCartes trouvées pour '{pokemon.Name}': {data.Count}");

                string subFolder = Path.Combine(imageDirectory, pokemon.Name);
                Directory.CreateDirectory(subFolder);

                foreach (var card in data)
                {

                    if (ShouldIgnoreCard(card.Name, pokemon.Name))
                        continue;
                    if (card.Image == null)
                    {
                        card.Image = "undefined";
                    }
                    Console.WriteLine(card.Image);
                    if (card.Image.Contains("/tcgp/"))
                    {
                        continue;
                    }
                    // Ici tu peux gérer l'ajout/upsert, par exemple éviter doublons
                    var exists = await db.PokemonCards.AnyAsync(c => c.Id == card.Id);
                    if (!exists)
                    {

                        card.Extension = card.Id.Split('-')[0];
                        card.PokemonId = pokemon.Id;

                        if (card.Image != "undefined")
                        {
                            string imageFilePath = Path.Combine(subFolder, $"{card.Id}.jpg");
                            card.Image = card.Image + "/low.jpg";
                            await DownloadImageAsync(card.Image, imageFilePath, client);
                            card.Image = $"/assets/images/{pokemon.Name}/{card.Id}.jpg";
                        }



                        db.PokemonCards.Add(card);
                    }
                }
                await db.SaveChangesAsync();
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
        }
    }

    private static async Task<List<PokemonCard>> GetPokemonData(string pokemonName, HttpClient client)
    {
        if (pokemonName.Contains("Méga-"))
        {
            pokemonName = pokemonName.Replace("Méga-", "M-");
        }

        if (pokemonName.Contains("GMax"))
        {
            pokemonName = pokemonName.Replace("GMax", "VMAX");
        }

        Console.WriteLine($"pokemonName apres changement {pokemonName}");
        string url = $"https://api.tcgdex.net/v2/fr/cards?name=like:{Uri.EscapeDataString(pokemonName)}*";

        var json = await client.GetStringAsync(url);

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
        return JsonSerializer.Deserialize<List<PokemonCard>>(json, options);
    }

    private static async Task DownloadImageAsync(string url, string filePath, HttpClient client)
    {
        try
        {
            var stream = await client.GetStreamAsync(url);
            using var fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write);
            await stream.CopyToAsync(fileStream);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erreur lors du téléchargement de {url} : {ex.Message}");
        }
    }

    private static bool ShouldIgnoreCard(string cardName, string pokemonName)
    {
        if (cardName.Contains("Hisui", StringComparison.OrdinalIgnoreCase) && !pokemonName.Contains("Hisui", StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }
        if (cardName.Contains("Galar", StringComparison.OrdinalIgnoreCase) && !pokemonName.Contains("Galar", StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }
        if (cardName.Contains("Alola", StringComparison.OrdinalIgnoreCase) && !pokemonName.Contains("Alola", StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }
        if (cardName.Contains("M-", StringComparison.OrdinalIgnoreCase) && !pokemonName.Contains("Méga", StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }
        if (cardName.Contains("VMAX", StringComparison.OrdinalIgnoreCase) && !pokemonName.Contains("GMax", StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }
        return false;
    }

}
