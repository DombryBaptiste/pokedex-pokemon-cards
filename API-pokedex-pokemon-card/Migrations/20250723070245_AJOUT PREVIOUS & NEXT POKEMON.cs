using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API_pokedex_pokemon_card.Migrations
{
    /// <inheritdoc />
    public partial class AJOUTPREVIOUSNEXTPOKEMON : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "NextPokemonId",
                table: "Pokemons",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PreviousPokemonId",
                table: "Pokemons",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NextPokemonId",
                table: "Pokemons");

            migrationBuilder.DropColumn(
                name: "PreviousPokemonId",
                table: "Pokemons");
        }
    }
}
