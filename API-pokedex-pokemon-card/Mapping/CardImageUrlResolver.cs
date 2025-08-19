using AutoMapper;

public class CardImageUrlResolver : IValueResolver<PokemonCard, PokemonCardDto, string>
{
    private readonly IConfiguration _config;

    public CardImageUrlResolver(IConfiguration config)
    {
        _config = config;
    }

    public string Resolve(PokemonCard source, PokemonCardDto destination, string destMember, ResolutionContext context)
    {
        var baseUrl = _config["StorageCardImage"];
        return string.IsNullOrEmpty(source.Image) ? null : baseUrl + source.Image;
    }
}
