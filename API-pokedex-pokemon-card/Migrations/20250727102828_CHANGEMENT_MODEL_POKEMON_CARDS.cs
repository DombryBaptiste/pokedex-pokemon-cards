using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API_pokedex_pokemon_card.Migrations
{
    /// <inheritdoc />
    public partial class CHANGEMENT_MODEL_POKEMON_CARDS : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PokemonCards_Pokemons_PokemonId",
                table: "PokemonCards");

            migrationBuilder.DropIndex(
                name: "IX_PokemonCards_PokemonId",
                table: "PokemonCards");

            migrationBuilder.DropColumn(
                name: "PokemonId",
                table: "PokemonCards");

            migrationBuilder.CreateTable(
                name: "PokemonCardPokemons",
                columns: table => new
                {
                    PokemonCardId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PokemonId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PokemonCardPokemons", x => new { x.PokemonId, x.PokemonCardId });
                    table.ForeignKey(
                        name: "FK_PokemonCardPokemons_PokemonCards_PokemonCardId",
                        column: x => x.PokemonCardId,
                        principalTable: "PokemonCards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PokemonCardPokemons_Pokemons_PokemonId",
                        column: x => x.PokemonId,
                        principalTable: "Pokemons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_PokemonCardPokemons_PokemonCardId",
                table: "PokemonCardPokemons",
                column: "PokemonCardId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PokemonCardPokemons");

            migrationBuilder.AddColumn<int>(
                name: "PokemonId",
                table: "PokemonCards",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_PokemonCards_PokemonId",
                table: "PokemonCards",
                column: "PokemonId");

            migrationBuilder.AddForeignKey(
                name: "FK_PokemonCards_Pokemons_PokemonId",
                table: "PokemonCards",
                column: "PokemonId",
                principalTable: "Pokemons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
