public class ScrapOptions
{
    public int? GenerationId { get; set; }
    public string? PokemonName { get; set; }
    public string Path { get; set; }
    public bool DownloadImages { get; set; }

    public static ScrapOptions? ParseArgs(string[] args)
    {
        int? genId = null;
        string? pokemonName = null;
        string? path = null;
        bool downloadImages = false;

        for (int i = 0; i < args.Length; i++)
        {
            if (args[i] == "-g" && i + 1 < args.Length)
            {
                genId = int.Parse(args[i + 1]);
                i++;
            }
            else if (args[i] == "-p" && i + 1 < args.Length)
            {
                pokemonName = args[i + 1];
                i++;
            }
            else if (args[i] == "--path" && i + 1 < args.Length)
            {
                path = args[i + 1];
                i++;
            }
            else if (args[i] == "--download" || args[i] == "-d")
            {
                downloadImages = true;
            }
        }

        // Validation : un seul des deux doit être présent
        bool hasGen = genId != null;
        bool hasPokemon = !string.IsNullOrEmpty(pokemonName);

        if (path == null || (!hasGen && !hasPokemon) || (hasGen && hasPokemon))
        {
            Console.WriteLine("Usage : dotnet run -- (-g <generation> | -p <nom>) --path <chemin> [--download]");
            return null;
        }

        return new ScrapOptions
        {
            GenerationId = genId,
            PokemonName = pokemonName,
            Path = path,
            DownloadImages = downloadImages
        };
    }

}