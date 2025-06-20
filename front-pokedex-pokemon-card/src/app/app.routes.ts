import { Routes } from '@angular/router';
import { ProfileComponent } from './Component/profile/profile.component';
import { PokedexComponent } from './Component/pokedex/pokedex.component';
import { PokemonDetailsComponent } from './Component/pokemon-details/pokemon-details.component';

export const routes: Routes = [
    { path: 'profile', component: ProfileComponent },
    { path: 'pokedex/:gen', component: PokedexComponent },
    { path: 'pokedex/pokemon/:id', component: PokemonDetailsComponent}
];
