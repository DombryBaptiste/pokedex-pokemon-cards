using API_pokedex_pokemon_card.Models;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private IUserService _userService;
    private IMapper _mapper;
    public UserController(IUserService userService, IMapper mapper)
    {
        _userService = userService;
        _mapper = mapper;
    }

    [HttpPut]
    public async Task<IActionResult> PutUser(UserUpdateDto userDto)
    {
        try
        {
            var updatedUser = await _userService.UpdateUserAsync(_mapper.Map<User>(userDto));

            if (updatedUser == null)
                return NotFound();

            return Ok();
        }
        catch (Exception)
        {
            return BadRequest("Une erreur est survenue lors de la mise à jour de l'utilisateur.");
        }
    }

    [HttpPost("visibility/{id}")]
    public async Task<IActionResult> SetPokemonVisibility(int id, [FromBody] VisibilityDto dto)
    {
        try
        {
            await _userService.SetPokemonVisibility(id, dto.Hidden);
            return Ok();
        }
        catch (Exception)
        {
            return BadRequest($"Erreur lors du changement de visibilité du pokémon d'id : {id}.");
        }
    }
}