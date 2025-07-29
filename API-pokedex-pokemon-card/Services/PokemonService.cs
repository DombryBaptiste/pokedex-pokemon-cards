using API_pokedex_pokemon_card.Infrastructure;
using API_pokedex_pokemon_card.Models;
using Microsoft.EntityFrameworkCore;

public class PokemonService : IPokemonService
{
    private readonly AppDbContext _context;
    private readonly IUserContext _userContext;
    public PokemonService(AppDbContext context, IUserContext userContext)
    {
        _context = context;
        _userContext = userContext;
    }

    public async Task<List<Pokemon>> GetAllPokemon()
    {
        return await _context.Pokemons.ToListAsync();
    }

    public async Task<List<PokemonListDto>> GetAllPokemonFiltered(PokemonFilterDto filters)
    {
        IQueryable<Pokemon> query = _context.Pokemons.AsNoTracking();

        HashSet<int> bothWantedAndOwnedIds = new();
        HashSet<int> wantedPokemonIds = new();

        if (filters?.PokedexId is int pokedexId)
        {
            var pokedex = await _context.Pokedexs
                .Include(p => p.OwnedPokemonCards)
                .Include(p => p.WantedPokemonCards)
                .FirstOrDefaultAsync(p => p.Id == pokedexId);

            if (pokedex != null)
            {
                // Création des paires pour Owned et Wanted
                var ownedCardPairs = pokedex.OwnedPokemonCards
                .Select(o => new { o.PokemonId, o.PokemonCardId });

                var wantedCardPairs = pokedex.WantedPokemonCards
                    .Select(w => new { w.PokemonId, w.PokemonCardId });

                // Intersection des paires
                 bothWantedAndOwnedIds = ownedCardPairs
                    .Intersect(wantedCardPairs)
                    .Select(p => p.PokemonId)
                    .ToHashSet();

                // Liste des PokemonId recherchés
                wantedPokemonIds = pokedex.WantedPokemonCards
                    .Select(w => w.PokemonId)
                    .ToHashSet();

                // Appliquer les filtres
                if (filters.FilterExceptWantedAndOwned == true)
                {
                    query = query.Where(p => !bothWantedAndOwnedIds.Contains(p.Id));
                }

                if (filters.FilterExceptHasNoWantedCard == true)
                {
                    query = query.Where(p => wantedPokemonIds.Contains(p.Id));
                }
            }
        }

        if (filters?.FilterGeneration is int generation)
        {
            query = query.Where(p => p.Generation == generation);
        }
        if (filters?.FilterHiddenActivated == false)
            {
                var hiddenIds = await _context.Users.Where(u => u.Id == _userContext.UserId).Select(u => u.HiddenPokemonIds).FirstOrDefaultAsync();
                if (hiddenIds != null && hiddenIds.Any())
                {
                    query = query.Where(p => !hiddenIds.Contains(p.Id));
                }
            }

        // Filtre par nom
        if (!string.IsNullOrWhiteSpace(filters?.FilterName))
        {
            var filter = $"%{filters.FilterName}%";
            query = query.Where(p => EF.Functions.Like(p.Name, filter));
        }

        return await query
            .Select(p => new PokemonListDto
            {
                Id = p.Id,
                Name = p.Name,
                Generation = p.Generation,
                ImagePath = p.ImagePath,
                PokedexId = p.PokedexId,
                IsWantedAndOwned = bothWantedAndOwnedIds.Contains(p.Id)
            })
            .ToListAsync();
    }

    public async Task<Pokemon?> GetPokemonById(int id)
    {
        var pokemon = await _context.Pokemons
            .Include(p => p.PokemonCardPokemons)
                .ThenInclude(pcp => pcp.PokemonCard)
                    .ThenInclude(pc => pc.Set)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (pokemon != null)
        {
            pokemon.PokemonCards = pokemon.PokemonCardPokemons
                .Select(pcp =>
                {
                    var card = pcp.PokemonCard;
                    card.PokemonId = pokemon.Id;
                    return card;
                })
                .OrderBy(card => card.Set.ReleaseDate)
                .ToList();
        }


        return pokemon;
    }

}