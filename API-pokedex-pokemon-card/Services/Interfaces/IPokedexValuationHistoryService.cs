public interface IPokedexValuationHistoryService
{
    public Task UpdateTodaySum(int pokedexId);
    public Task<PokedexStatsDto> GetStatsByPokedexId(int pokedexId);
}