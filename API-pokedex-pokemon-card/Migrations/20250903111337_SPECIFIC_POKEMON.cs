using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API_pokedex_pokemon_card.Migrations
{
    /// <inheritdoc />
    public partial class SPECIFIC_POKEMON : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PokedexSpecificPokemons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    PokedexId = table.Column<int>(type: "int", nullable: false),
                    Slot = table.Column<int>(type: "int", nullable: false),
                    PokemonId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PokedexSpecificPokemons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PokedexSpecificPokemons_Pokedexs_PokedexId",
                        column: x => x.PokedexId,
                        principalTable: "Pokedexs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_PokedexSpecificPokemons_PokedexId",
                table: "PokedexSpecificPokemons",
                column: "PokedexId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PokedexSpecificPokemons");
        }
    }
}
