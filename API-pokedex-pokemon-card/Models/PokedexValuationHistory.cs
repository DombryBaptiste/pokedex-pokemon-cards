using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class PokedexValuationHistory
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int PokedexId { get; set; }

    [Required]
    [Column(TypeName = "decimal(10,2)")]
    public decimal TotalValue { get; set; }

    [Required]
    public DateTime RecordedAt { get; set; }

    public Pokedex Pokedex { get; set; }
}
