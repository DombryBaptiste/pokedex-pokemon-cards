using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class PokemonController : ControllerBase
{
    [HttpGet("{pokemon}")]
    public async Task<string> GetAllPokemonById(string pokemon)
    {
        var apiUrl = $"https://api.tcgdex.net/v2/en/cards?name={pokemon}";

        using var httpClient = new HttpClient();
        var response = await httpClient.GetStringAsync(apiUrl);

        return response;
    }
}