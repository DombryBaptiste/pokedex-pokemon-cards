using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API_pokedex_pokemon_card.Migrations
{
    /// <inheritdoc />
    public partial class ACQUIREDPRICE : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<float>(
                name: "Price",
                table: "PokedexOwnedPokemonCards",
                type: "float",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(10,2)");

            migrationBuilder.AddColumn<float>(
                name: "AcquiredPrice",
                table: "PokedexOwnedPokemonCards",
                type: "float",
                nullable: false,
                defaultValue: 0f);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AcquiredPrice",
                table: "PokedexOwnedPokemonCards");

            migrationBuilder.AlterColumn<decimal>(
                name: "Price",
                table: "PokedexOwnedPokemonCards",
                type: "decimal(10,2)",
                nullable: false,
                oldClrType: typeof(float),
                oldType: "float");
        }
    }
}
