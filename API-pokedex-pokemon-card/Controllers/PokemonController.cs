using API_pokedex_pokemon_card.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class PokemonController : ControllerBase
{
    IPokemonService _pokemonService;
    IUserContext _userContext;

    public PokemonController(IPokemonService pokemonService, IUserContext userContext)
    {
        _pokemonService = pokemonService;
        _userContext = userContext;
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
    public async Task<IActionResult> GetAllPokemonByGen(int id, [FromQuery] PokemonFilterDto filters)
    {
        try
        {
            return Ok(await _pokemonService.GetAllPokemonByGen(id, filters));
        }
        catch (Exception)
        {
            return BadRequest("Une erreur est surevenue lors de la récupération des pokémons");
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPokemonById(int id)
    {
        try
        {
            var pokemon = await _pokemonService.GetPokemonById(id);
            if (pokemon == null)
            {
                return NotFound($"Aucun Pokémon trouvé avec l'id : {id}.");
            }

            return Ok(pokemon);
        }
        catch (Exception)
        {
            return BadRequest($"Une erreur est surevenue lors de la récupération du pokémon d'id : {id}.");
        }
    }
}