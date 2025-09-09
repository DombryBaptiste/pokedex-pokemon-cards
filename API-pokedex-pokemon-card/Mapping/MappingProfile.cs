using API_pokedex_pokemon_card.Models;
using AutoMapper;

namespace API_pokedex_pokemon_card.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<UserUpdateDto, User>();
        CreateMap<User, UserDto>();
        CreateMap<PokemonCardOwnedUpdate, PokedexOwnedPokemonCard>();
        CreateMap<PokemonCard, PokemonCardDto>()
            .ForMember(dest => dest.Image, opt => opt.MapFrom<CardImageUrlResolver>());
        CreateMap<PokedexOwnedPokemonCard, OwnedPokemonCardDto>();
        CreateMap<Pokemon, PokemonListDto>()
            .ForMember(dest => dest.ImagePath, opt => opt.MapFrom<CardImageUrlResolver>());
        CreateMap<CardPrinting, CardPrintingDto>();
        CreateMap<Pokemon, PokemonDto>()
            .ForMember(dest => dest.ImagePath, opt => opt.MapFrom<CardImageUrlResolver>());;
    }
}