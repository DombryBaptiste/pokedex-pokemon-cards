using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("[controller]")]
public class PokemonCardController : ControllerBase
{
    IPokemonCardService _pokemonCardService;
    IMapper _mapper;
    public PokemonCardController(IPokemonCardService pokemonCardService, IMapper mapper)
    {
        _pokemonCardService = pokemonCardService;
        _mapper = mapper;
    }

    [HttpGet("{pokemonId}")]
    public async Task<IActionResult> GetAllCardsByPokemonId(int pokemonId)
    {
        try
        {
            return Ok(_mapper.Map<List<PokemonCardDto>>(await _pokemonCardService.GetAllByPokemonIdAsync(pokemonId)));
        }
        catch (Exception e)
        {
            return BadRequest($"Une erreur est surevenue lors de la récupération des carte du pokémon d'id {pokemonId}");
        }
    }

    [HttpPost("{pokedexId}/set-wanted-card")]
    public async Task<IActionResult> SetChaseCard(int pokedexId, [FromBody] SetCardRequest dto)
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
    public async Task<IActionResult> SetOwnedCard(int pokedexId, [FromBody] SetCardRequest dto)
    {
        try
        {
            return Ok(await _pokemonCardService.SetOwnedCardAsync(pokedexId, dto.CardId, dto.PokemonId, dto.Type));
        }
        catch (Exception)
        {
            return BadRequest($"Une erreur est surevenue lors de l'ajout de la carte {dto.CardId}");
        }
    }

    [HttpPost("{pokedexId}/set-owned-card-pokemon")]
    public async Task<IActionResult> SetOwnedCardByPokemon(int pokedexId, [FromBody] SetCardRequest dto)
    {
        try
        {
            await _pokemonCardService.SetOwnedCardByPokemonAsync(pokedexId, dto.CardId, dto.PokemonId);
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

    [HttpDelete("{pokedexId}/{pokemonCardId}")]
    public async Task<IActionResult> DeletePokedexCard(int pokedexId, string pokemonCardId, [FromQuery] PokemonCardDeleteDto dto)
    {
        try
        {
            await _pokemonCardService.DeleteCard(pokedexId, pokemonCardId, dto.PrintingType ,dto.Type);
            return Ok();
        }
        catch (Exception)
        {
            return BadRequest($"Une erreur est surevenue lors de la suppression de la cartes d'id : {pokemonCardId}.");
        }
    }

    [HttpPut("owned-card/{cardId}")]
    public async Task<IActionResult> UpdatePokedexCard(int cardId, [FromBody] PokemonCardOwnedUpdate card)
    {
        try
        {
            var result = await _pokemonCardService.UpdateOwnedCard(cardId, _mapper.Map<PokedexOwnedPokemonCard>(card));
            if (result == null)
            {
                return NotFound($"Carte d'id : {cardId} est introuvable.");
            }
            return Ok(result);
        }
        catch (Exception)
        {
            return BadRequest($"Une erreur est surevenue lors de la mise a jour de la cartes d'id : {cardId}.");
        }
    }

    [AllowAnonymous]
    [HttpGet("wanted-but-no-owned-cards/{pokedexId}")]
    public async Task<IActionResult> GetAllCardWantedAndNotOwned(int pokedexId)
    {
        try
        {
            var result = await _pokemonCardService.GetAllWantedButNotOwnedCardByPokedexId(pokedexId);
            return Ok(result);
        }
        catch (Exception)
        {
            return BadRequest($"Une erreur est surevenue lors de la récupération des cartes du pokedex d'id : {pokedexId}.");
        }
    }

    [HttpGet("owned/{pokedexId}")]
    public async Task<IActionResult> GetAllOwnedCards(int pokedexId)
    {
        try
        {
            var result = await _pokemonCardService.GetAllOwnedCards(pokedexId);
            return Ok(_mapper.Map<List<OwnedPokemonCardDto>>(result));
        }
        catch (Exception)
        {
            return BadRequest($"Une erreur est surevenue lors de la récupération des cartes du pokedex d'id : {pokedexId}.");
        }
    }

    [HttpPost("{cardId}/type-card")]
    public async Task<ActionResult> SetTypeCard(string cardId, [FromBody] SetCardTypeRequest req)
    {
        try
        {
            if (req.isDelete)
            {
                await _pokemonCardService.DeleteTypeCard(cardId, req.Type);
            }
            else
            {
                await _pokemonCardService.SetTypeCard(cardId, req.Type);
            }
            return Ok();
        }
        catch (Exception)
        {
            return BadRequest($"Une erreur est surevenue lors de la création/suppression du type de la carte d'id : {cardId}.");
        }
    }
}