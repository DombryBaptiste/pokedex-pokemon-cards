using System.Security.Claims;
using System.Threading.Tasks;
using API_pokedex_pokemon_card.Dtos;
using API_pokedex_pokemon_card.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IUserService _userService;

    public AuthController(IAuthService authService, IUserService userService)
    {
        _authService = authService;
        _userService = userService;
    }

    [HttpPost("google-login")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto dto)
    {
        try
        {
            var token = await _authService.LoginWithGoogleAsync(dto.Token);
            return Ok(new { token });
        }
        catch (SecurityTokenException)
        {
            return BadRequest("Jeton Google invalide.");
        }
    }

    [Authorize]
    [HttpGet("current-user")]
    public async Task<IActionResult> GetCurrentUserAsync()
    {
        try
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            if (email == null)
            {
                return Unauthorized("Email claim manquant.");
            }
            var user = await _userService.GetUserByEmailAsync(email);
            if (user == null)
            {
                return NotFound("Utilisateur non trouvé.");
            }
            return Ok(user);
        }
        catch (Exception e)
        {
            return BadRequest(e);
        }
    }
}
