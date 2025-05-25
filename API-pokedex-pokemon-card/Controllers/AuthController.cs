using API_pokedex_pokemon_card.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
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
}
