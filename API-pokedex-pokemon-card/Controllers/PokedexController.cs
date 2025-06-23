using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
[Authorize]
public class PokedexController : ControllerBase
{
    private readonly IPokedexService _pokedexService;
    public PokedexController(IPokedexService pokedexService)
    {
        _pokedexService = pokedexService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] PokedexCreateDto dto)
    {
        try
        {
            await _pokedexService.CreateAsync(dto.UserId, dto.Name);
            return Ok();
        }
        catch (Exception)
        {
            return BadRequest($"Une erreur est surevenue lors de la création du pokédex {dto.Name}.");
        }
    }

    [HttpGet("{pokedexId}")]
    public async Task<IActionResult> GetById(int pokedexId)
    {
        try
        {
            var result = await _pokedexService.GetByIdAsync(pokedexId);
            if (result == null)
            {
                return NotFound($"Le pokédex d'id : {pokedexId} n'existe pas.");
            }
            return Ok(result);
        }
        catch (Exception)
        {
            return BadRequest($"Une erreur est surevenue lors de la récupération du pokédex {pokedexId}.");
        }
    }

    [HttpPost("add-with-share-code")]
    public async Task<IActionResult> AddWithShareCode([FromBody] PokedexCreateCodeDto dto)
    {
        try
        {
            var result = await _pokedexService.CreateByShareCode(dto.ShareCode, dto.UserId);
            if (result == null)
            {
                return NotFound($"Le pokédex de code de partage : {dto.ShareCode} n'existe pas.");
            }
            return Ok();
        }
        catch (Exception)
        {
            return BadRequest($"Une erreur est surevenue lors de l'ajout du pokédex de code de partage : {dto.ShareCode}.");
        }
    }
}