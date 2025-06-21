import { Routes } from '@angular/router';
import { ProfileComponent } from './Component/profile/profile.component';
import { PokedexComponent } from './Component/pokedex/pokedex.component';
import { PokemonDetailsComponent } from './Component/pokemon-details/pokemon-details.component';
import { AuthGuard } from './Guards/auth.guard';
import { CreatePokedexComponent } from './Component/create-pokedex/create-pokedex.component';

export const routes: Routes = [
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'pokedex/create', component: CreatePokedexComponent, canActivate: [AuthGuard] },
    { path: 'pokedex/:pokedexId/pokemon/:id', component: PokemonDetailsComponent, canActivate: [AuthGuard] },
    { path: 'pokedex/:pokedexId/:gen', component: PokedexComponent, canActivate: [AuthGuard] },
];
