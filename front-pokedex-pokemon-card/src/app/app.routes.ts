import { Routes } from '@angular/router';
import { ProfileComponent } from './Component/profile/profile.component';
import { PokedexComponent } from './Component/pokedex/pokedex.component';

export const routes: Routes = [
    { path: 'profile', component: ProfileComponent },
    { path: 'pokedex', component: PokedexComponent }
];
