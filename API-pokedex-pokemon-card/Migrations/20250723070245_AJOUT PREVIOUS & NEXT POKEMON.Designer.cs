﻿// <auto-generated />
using System;
using API_pokedex_pokemon_card.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace API_pokedex_pokemon_card.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20250723070245_AJOUT PREVIOUS & NEXT POKEMON")]
    partial class AJOUTPREVIOUSNEXTPOKEMON
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.13")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            MySqlModelBuilderExtensions.AutoIncrementColumns(modelBuilder);

            modelBuilder.Entity("API_pokedex_pokemon_card.Models.Pokemon", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("Generation")
                        .HasColumnType("int");

                    b.Property<string>("ImagePath")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int?>("NextPokemonId")
                        .HasColumnType("int");

                    b.Property<int>("PokedexId")
                        .HasColumnType("int");

                    b.Property<int?>("PreviousPokemonId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Pokemons");
                });

            modelBuilder.Entity("API_pokedex_pokemon_card.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("HiddenPokemonIds")
                        .HasColumnType("longtext");

                    b.Property<DateTime>("LastLoggedIn")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("PictureProfilPath")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Pseudo")
                        .HasColumnType("longtext");

                    b.Property<DateTime>("UpdatedDate")
                        .HasColumnType("datetime(6)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Pokedex", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("ShareCode")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Pokedexs");
                });

            modelBuilder.Entity("PokedexOwnedPokemonCard", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("AcquiredDate")
                        .HasColumnType("datetime(6)");

                    b.Property<float>("AcquiredPrice")
                        .HasColumnType("float");

                    b.Property<int>("PokedexId")
                        .HasColumnType("int");

                    b.Property<string>("PokemonCardId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<int>("PokemonId")
                        .HasColumnType("int");

                    b.Property<float>("Price")
                        .HasColumnType("float");

                    b.HasKey("Id");

                    b.HasIndex("PokedexId");

                    b.HasIndex("PokemonCardId");

                    b.HasIndex("PokemonId");

                    b.ToTable("PokedexOwnedPokemonCards");
                });

            modelBuilder.Entity("PokedexUser", b =>
                {
                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.Property<int>("PokedexId")
                        .HasColumnType("int");

                    b.Property<bool>("IsOwner")
                        .HasColumnType("tinyint(1)");

                    b.HasKey("UserId", "PokedexId");

                    b.HasIndex("PokedexId");

                    b.ToTable("PokedexUsers");
                });

            modelBuilder.Entity("PokedexValuationHistory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("PokedexId")
                        .HasColumnType("int");

                    b.Property<DateTime>("RecordedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<decimal>("TotalValue")
                        .HasColumnType("decimal(10,2)");

                    b.HasKey("Id");

                    b.HasIndex("PokedexId");

                    b.ToTable("PokedexValuationHistory");
                });

            modelBuilder.Entity("PokedexWantedPokemonCard", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("AddedDate")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Notes")
                        .HasColumnType("longtext");

                    b.Property<int>("PokedexId")
                        .HasColumnType("int");

                    b.Property<string>("PokemonCardId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<int>("PokemonId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("PokedexId");

                    b.HasIndex("PokemonCardId");

                    b.HasIndex("PokemonId");

                    b.ToTable("PokedexWantedPokemonCards");
                });

            modelBuilder.Entity("PokemonCard", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Extension")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Image")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("LocalId")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("PokemonId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("PokemonId");

                    b.ToTable("PokemonCards");
                });

            modelBuilder.Entity("PokedexOwnedPokemonCard", b =>
                {
                    b.HasOne("Pokedex", "Pokedex")
                        .WithMany("OwnedPokemonCards")
                        .HasForeignKey("PokedexId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("PokemonCard", "PokemonCard")
                        .WithMany()
                        .HasForeignKey("PokemonCardId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API_pokedex_pokemon_card.Models.Pokemon", "Pokemon")
                        .WithMany()
                        .HasForeignKey("PokemonId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Pokedex");

                    b.Navigation("Pokemon");

                    b.Navigation("PokemonCard");
                });

            modelBuilder.Entity("PokedexUser", b =>
                {
                    b.HasOne("Pokedex", "Pokedex")
                        .WithMany("PokedexUsers")
                        .HasForeignKey("PokedexId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API_pokedex_pokemon_card.Models.User", "User")
                        .WithMany("PokedexUsers")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Pokedex");

                    b.Navigation("User");
                });

            modelBuilder.Entity("PokedexValuationHistory", b =>
                {
                    b.HasOne("Pokedex", "Pokedex")
                        .WithMany()
                        .HasForeignKey("PokedexId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Pokedex");
                });

            modelBuilder.Entity("PokedexWantedPokemonCard", b =>
                {
                    b.HasOne("Pokedex", "Pokedex")
                        .WithMany("WantedPokemonCards")
                        .HasForeignKey("PokedexId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("PokemonCard", "PokemonCard")
                        .WithMany()
                        .HasForeignKey("PokemonCardId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API_pokedex_pokemon_card.Models.Pokemon", "Pokemon")
                        .WithMany()
                        .HasForeignKey("PokemonId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Pokedex");

                    b.Navigation("Pokemon");

                    b.Navigation("PokemonCard");
                });

            modelBuilder.Entity("PokemonCard", b =>
                {
                    b.HasOne("API_pokedex_pokemon_card.Models.Pokemon", "Pokemon")
                        .WithMany("PokemonCards")
                        .HasForeignKey("PokemonId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Pokemon");
                });

            modelBuilder.Entity("API_pokedex_pokemon_card.Models.Pokemon", b =>
                {
                    b.Navigation("PokemonCards");
                });

            modelBuilder.Entity("API_pokedex_pokemon_card.Models.User", b =>
                {
                    b.Navigation("PokedexUsers");
                });

            modelBuilder.Entity("Pokedex", b =>
                {
                    b.Navigation("OwnedPokemonCards");

                    b.Navigation("PokedexUsers");

                    b.Navigation("WantedPokemonCards");
                });
#pragma warning restore 612, 618
        }
    }
}
