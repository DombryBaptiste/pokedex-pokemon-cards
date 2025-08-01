import { PokedexUser } from "./pokedex";

export interface UserConnect {
    id: number;
    email: string;
    lastLoggedIn: Date;
    createdDate: Date;
    updatedDate: Date;
    pictureProfilPath: string;
    pseudo: string;
    hiddenPokemonIds: number[];
    pokedexUsers: PokedexUser[];
}