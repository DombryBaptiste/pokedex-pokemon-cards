import { Routes } from '@angular/router';
import { ProfileComponent } from './Component/profile/profile.component';
import { PokedexComponent } from './Component/pokedex/pokedex.component';
import { PokemonDetailsComponent } from './Component/pokemon-details/pokemon-details.component';
import { AuthGuard } from './Guards/auth.guard';

export const routes: Routes = [
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'pokedex/:gen', component: PokedexComponent, canActivate: [AuthGuard] },
    { path: 'pokedex/pokemon/:id', component: PokemonDetailsComponent, canActivate: [AuthGuard] }
];
