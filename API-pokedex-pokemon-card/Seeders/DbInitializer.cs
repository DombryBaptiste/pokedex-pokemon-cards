using System.Text.Json;
using API_pokedex_pokemon_card.Infrastructure;
using API_pokedex_pokemon_card.Models;

public static class DbInitializer
{
    public static void Seed(AppDbContext context)
    {
        if (!context.Pokemons.Any())
        {
            var jsonFilePath = Path.Combine("Assets", "pokemons.json");

            if (File.Exists(jsonFilePath))
            {
                var json = File.ReadAllText(jsonFilePath);
                var pokemons = JsonSerializer.Deserialize<List<Pokemon>>(json);

                if (pokemons != null)
                {
                    context.Pokemons.AddRange(pokemons);
                    context.SaveChanges();
                }
            }
            else
            {
                Console.WriteLine($"Le fichier {jsonFilePath} est introuvable.");
            }
        }
    }
}