
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API_pokedex_pokemon_card.Models;
using Google.Apis.Auth;
using Microsoft.IdentityModel.Tokens;

public class AuthService : IAuthService
{
    private readonly IConfiguration _configuration;
    private readonly IUserService _userService;

    public AuthService(IConfiguration configuration, IUserService userService)
    {
        _configuration = configuration;
        _userService = userService;
    }
    public async Task<string> LoginWithGoogleAsync(string token)
    {
        var payload = await VerifyGoogleToken(token);
        if (payload == null)
        {
            throw new SecurityTokenException("Token Google invalide");
        }

        var user = await _userService.GetUserByEmailAsync(payload.Email);
        if (user == null)
        {
            user = new User
            {
                Email = payload.Email,
                LastLoggedIn = DateTime.UtcNow
            };

            var success = await _userService.CreateAsync(user);
            if (!success)
            {
                throw new Exception("Erreur lors de la création de l'utilisateur");
            }
        }
        return GenerateJwtToken(user);
    }

    private async Task<GoogleJsonWebSignature.Payload?> VerifyGoogleToken(string token)
    {
        var settings = new GoogleJsonWebSignature.ValidationSettings()
        {
            Audience = [_configuration["Authentication:Google:ClientId"],]
        };

        try
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(token, settings);
            return payload;
        }
        catch
        {
            return null;
        }
    }

    private string GenerateJwtToken(User user)
    {
        var claims = new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new Claim(ClaimTypes.Name, user.Email)
    };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

}