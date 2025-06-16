using API_pokedex_pokemon_card.Models;
using AutoMapper;

namespace API_pokedex_pokemon_card.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<UserUpdateDto, User>();
        CreateMap<User, UserDto>();
    }
}