using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API_pokedex_pokemon_card.Migrations
{
    /// <inheritdoc />
    public partial class ONLYDATE : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateOnly>(
                name: "AcquiredDate",
                table: "PokedexOwnedPokemonCards",
                type: "date",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "AcquiredDate",
                table: "PokedexOwnedPokemonCards",
                type: "datetime(6)",
                nullable: false,
                oldClrType: typeof(DateOnly),
                oldType: "date");
        }
    }
}
