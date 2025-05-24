using Microsoft.AspNetCore.Mvc;
using API_pokedex_pokemon_card.Infrastructure;
using Microsoft.AspNetCore.Authorization;

namespace API_pokedex_pokemon_card.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class HealthController : ControllerBase
{
    private readonly AppDbContext _context;

    public HealthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("test-connection")]
    
    public async Task<IActionResult> TestConnection()
    {
        try
        {
            var canConnect = await _context.Database.CanConnectAsync();
            if (canConnect)
                return Ok("✅ Connexion à la base réussie !");
            else
                return StatusCode(500, "❌ Impossible de se connecter à la base.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"❌ Erreur de connexion : {ex.Message}");
        }
    }
}
