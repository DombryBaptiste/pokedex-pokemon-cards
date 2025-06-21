using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
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

    [HttpPost("{pokedexId}/set-wanted-card")]
    public async Task<IActionResult> SetChaseCard(int pokedexId, [FromBody] PokemonCardDto dto)
    {
        try
        {
            await _pokemonCardService.SetChaseCardAsync(pokedexId, dto.CardId, dto.PokemonId);
            return Ok();
        }
        catch (Exception)
        {
            return BadRequest($"Une erreur est surevenue lors de l'ajout de la carte {dto.CardId}");
        }
    }

    [HttpPost("{pokedexId}/set-owned-card")]
    public async Task<IActionResult> SetOwnedCard(int pokedexId, [FromBody] PokemonCardDto dto)
    {
        try
        {
            await _pokemonCardService.SetOwnedCardAsync(pokedexId, dto.CardId, dto.PokemonId);
            return Ok();
        }
        catch (Exception)
        {
            return BadRequest($"Une erreur est surevenue lors de l'ajout de la carte {dto.CardId}");
        }
    }
    
    [HttpGet("{pokedexId}/pokemon/{pokemonId}")]
    public async Task<IActionResult> GetCardByPokedexIdAndPokemonId(int pokedexId, int pokemonId)
    {
        try
        {
            var result = await _pokemonCardService.GetCardByPokedexAndPokemonIdAsync(pokedexId, pokemonId);
            if (result == null)
            {
                return NotFound($"Le pokédex d'id : {pokedexId} n'existe pas.");
            }
            return Ok(result);
        }
        catch (Exception)
        {
            return BadRequest($"Une erreur est surevenue lors de la récupération des cartes du pokemon d'id : {pokemonId}.");
        }
    }
}