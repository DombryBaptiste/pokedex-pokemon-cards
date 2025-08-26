public class PokemonListDto
{
        public int Id { get; set; }
        public required int PokedexId { get; set; }
        public required string Name { get; set; }
        public required int Generation { get; set; }
        public required string ImagePath { get; set; }
        public bool IsWantedAndOwned { get; set; }
        public int? PreviousPokemonId { get; set; }
        public int? NextPokemonId { get; set; }
        public bool IsHidden { get; set; }
        public string? FormatPokemonId { get; set; }
}