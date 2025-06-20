using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class PokemonCardController : ControllerBase
{
    IPokemonCardService _pokemonCardService;
    public PokemonCardController(IPokemonCardService pokemonCardService)
    {
        _pokemonCardService = pokemonCardService;
    }

    [HttpGet("{pokemonId}")]
    public async Task<IActionResult> GetAllCardsByPokemonId(int pokemonId)
    {
        try
        {
            return Ok(await _pokemonCardService.GetAllByPokemonIdAsync(pokemonId));
        }
        catch (Exception)
        {
            return BadRequest($"Une erreur est surevenue lors de la récupération des carte du pokémon d'id {pokemonId}");
        }
    }
}