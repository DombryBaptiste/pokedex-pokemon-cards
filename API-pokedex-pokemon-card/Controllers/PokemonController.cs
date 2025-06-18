using API_pokedex_pokemon_card.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class PokemonController : ControllerBase
{
    IPokemonService _pokemonService;

    public PokemonController(IPokemonService pokemonService)
    {
        _pokemonService = pokemonService;
    }
    [HttpGet("{pokemon}")]
    public async Task<string> GetAllPokemonById(string pokemon)
    {
        var apiUrl = $"https://api.tcgdex.net/v2/en/cards?name={pokemon}";

        using var httpClient = new HttpClient();
        var response = await httpClient.GetStringAsync(apiUrl);

        return response;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllPokemon()
    {
        try
        {
            return Ok(await _pokemonService.GetAllPokemon());
        }
        catch (Exception)
        {
            return BadRequest("Une erreur est surevenue lors de la récupération des pokémons");
        }
    }

    [HttpGet("generation/{id}")]
    public async Task<IActionResult> GetAllPokemonByGen(int id)
    {
        try
        {
            return Ok(await _pokemonService.GetAllPokemonByGen(id));
        }
        catch (Exception)
        {
            return BadRequest("Une erreur est surevenue lors de la récupération des pokémons");
        }
    }
}