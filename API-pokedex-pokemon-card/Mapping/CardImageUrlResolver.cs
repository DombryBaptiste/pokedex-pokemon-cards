using API_pokedex_pokemon_card.Models;
using AutoMapper;
using Microsoft.Extensions.Configuration;

public class CardImageUrlResolver :
    IValueResolver<PokemonCard, PokemonCardDto, string>,
    IValueResolver<Pokemon, PokemonListDto, string>
{
    private readonly IConfiguration _config;

    public CardImageUrlResolver(IConfiguration config)
    {
        _config = config;
    }

    // PokemonCard -> PokemonCardDto.Image
    string IValueResolver<PokemonCard, PokemonCardDto, string>.Resolve(
        PokemonCard source, PokemonCardDto destination, string destMember, ResolutionContext context)
        => BuildUrl(source.Image);

    // Pokemon -> PokemonListDto.ImagePath
    string IValueResolver<Pokemon, PokemonListDto, string>.Resolve(
        Pokemon source, PokemonListDto destination, string destMember, ResolutionContext context)
        => BuildUrl(source.ImagePath);

    private string BuildUrl(string file)
    {
        var baseUrl = _config["StorageCardImage"] ?? "";
        if (!baseUrl.EndsWith("/")) baseUrl += "/";
        return baseUrl + file.TrimStart('/');
    }
}
