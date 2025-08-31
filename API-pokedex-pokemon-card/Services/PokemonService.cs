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

    public async Task<List<PokemonListDto>> GetAllPokemonFiltered(PokemonFilterDto filters, CancellationToken ct = default)
    {
        var userId = _userContext.UserId;

        var query = _context.Pokemons.AsNoTracking().AsQueryable();

        int pokedexId = filters.PokedexId;
        IQueryable<int> ownedQ = Enumerable.Empty<int>().AsQueryable();
        IQueryable<int> wantedQ = Enumerable.Empty<int>().AsQueryable();

        if (pokedexId is int pid)
        {
            ownedQ = _context.Pokedexs.Where(px => px.Id == pid).SelectMany(px => px.OwnedPokemonCards).Select(c => c.PokemonId);
            wantedQ = _context.Pokedexs.Where(px => px.Id == pid).SelectMany(px => px.WantedPokemonCards).Select(c => c.PokemonId);

            if (filters.FilterExceptWantedAndOwned == true)
            {
                query = query.Where(p => !(ownedQ.Contains(p.Id) && wantedQ.Contains(p.Id)));
            }
            if (filters.FilterExceptHasNoWantedCard)
            {
                query = query.Where(p => wantedQ.Contains(p.Id));
            }
        }

        if (filters.FilterGeneration is int generation)
        {
            query = query.Where(p => p.Generation == generation);
        }

        if (!string.IsNullOrWhiteSpace(filters?.FilterName))
        {
            var term = filters.FilterName.Trim().ToLower();
            query = query.Where(p => EF.Functions.Like(p.Name.ToLower(), $"%{term}%"));
        }
        
        var result = await query
        .Select(p => new PokemonListDto
        {
            Id = p.Id,
            Name = p.Name,
            Generation = p.Generation,
            ImagePath = p.ImagePath,
            PokedexId = p.PokedexId,
            IsWantedAndOwned = ownedQ.Contains(p.Id) && wantedQ.Contains(p.Id),
            FormatPokemonId = "#" + p.PokedexId.ToString("D3")
        })
        .ToListAsync(ct);

        return result;
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