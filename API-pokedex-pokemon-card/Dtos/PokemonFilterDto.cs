public class PokemonFilterDto
{
    public int? FilterGeneration { get; set; }
    public bool FilterHiddenActivated { get; set; } = false;
    public string? FilterName { get; set; }
}