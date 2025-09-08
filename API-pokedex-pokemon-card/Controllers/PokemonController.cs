using API_pokedex_pokemon_card.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("[controller]")]
public class PokemonController : ControllerBase
{
    IPokemonService _pokemonService;
    IMapper _mapper;

    public PokemonController(IPokemonService pokemonService, IMapper mapper)
    {
        _pokemonService = pokemonService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllPokemon()
    {
        try
        {
            return Ok(_mapper.Map<List<PokemonListDto>>(await _pokemonService.GetAllPokemon())); 
        }
        catch (Exception)
        {
            return BadRequest("Une erreur est surevenue lors de la récupération des pokémons");
        }
    }

    [HttpGet("filtered")]
    public async Task<IActionResult> GetAllPokemonFiltered([FromQuery] PokemonFilterDto filters, CancellationToken ct)
    {
        try
        {
            return Ok(await _pokemonService.GetAllPokemonFiltered(filters, ct));
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