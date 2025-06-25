using System;
using System.Net.Http;
using System.Text.Json;
using API_pokedex_pokemon_card.Models;
using Microsoft.EntityFrameworkCore;

class Program
{
    static async Task Main(string[] args)
    {

        var options = ScrapOptions.ParseArgs(args);
        if (options == null)
        {
            Console.WriteLine("Usage : dotnet run -- -g <generation_id> --path <chemin> [--download]");
            return;
        }

        var path = Path.Combine(options.Path);
        bool downloadImages = options.DownloadImages;
        int? genId = options.GenerationId;
        // if (args.Length < 2)
        // {
        //     Console.WriteLine("Usage : dotnet run -- <generation_id> <path>");
        //     return;
        // }

        // int genId = int.Parse(args[0]);
        // var path = Path.Combine(args[1]);

        using var client = new HttpClient();

        try
        {
            List<Pokemon> pokemonList;

            using var db = new AppDbContext();
            db.Database.EnsureCreated();

            if (options.GenerationId != null)
            {
                pokemonList = await db.Pokemons
                    .Where(p => p.Generation == options.GenerationId)
                    .ToListAsync();
            }
            else
            {
                pokemonList = await db.Pokemons
                    .Where(p => p.Name == options.PokemonName)
                    .ToListAsync();
            }

            if (!pokemonList.Any())
            {
                Console.WriteLine("Aucun Pokémon trouvé.");
                return;
            }
            // using var db = new AppDbContext();
            // db.Database.EnsureCreated();

            // var pokemonList = await db.Pokemons.Where(p => p.Generation == genId).ToListAsync();
            // var pokemonList = await db.Pokemons.Where(p => EF.Functions.Like(p.Name, "%Arcanin%")).ToListAsync();

            var imageDirectory = Path.Combine(path, "pokemon-card-pictures");
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
                            if (options.DownloadImages)
                            {
                                Console.WriteLine("Download");
                                await DownloadImageAsync(card.Image, imageFilePath, client);
                            }

                            card.Image = $"/pokemon-card-pictures/{pokemon.Name}/{card.Id}.jpg";
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
        Console.WriteLine(url);

        var json = await client.GetStringAsync(url);

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
        var cards = JsonSerializer.Deserialize<List<PokemonCard>>(json, options);
        return cards?.Where(c => IsCardMatchingPokemon(c.Name, pokemonName)).ToList();

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
    
    private static bool IsCardMatchingPokemon(string cardName, string pokemonName)
    {
        cardName = cardName.ToLower();
        pokemonName = pokemonName.ToLower();

        // Évite les faux positifs comme Dracolosse
        if (cardName.StartsWith(pokemonName + " ") || cardName == pokemonName)
        {
            return true;
        }

        // Accepte "Draco Obscur", "Draco V", etc.
        if (cardName.Contains(pokemonName + " "))
        {
            return true;
        }

        return false;
    }

}
