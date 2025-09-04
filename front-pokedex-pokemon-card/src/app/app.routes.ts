import { Routes } from '@angular/router';
import { ProfileComponent } from './Component/profile/profile.component';
import { PokedexComponent } from './Component/pokedex/pokedex.component';
import { PokemonDetailsComponent } from './Component/pokemon-details/pokemon-details.component';
import { AuthGuard } from './Guards/auth.guard';
import { CreatePokedexComponent } from './Component/create-pokedex/create-pokedex.component';
import { HomeComponent } from './Component/home/home.component';
import { PokedexStatsComponent } from './Component/pokedex-stats/pokedex-stats.component';
import { SharedWantedCardComponent } from './Component/shared-wanted-card/shared-wanted-card.component';
import { PanelAdminComponent } from './Component/panel-admin/panel-admin.component';
import { AdminGuard } from './Guards/admin.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'pokedex/stats/:pokedexId', component: PokedexStatsComponent, canActivate: [AuthGuard] },
    { path: 'pokedex/:pokedexId/shared-wanted-cards', component: SharedWantedCardComponent},
    { path: 'pokedex/create', component: CreatePokedexComponent, canActivate: [AuthGuard] },
    { path: 'pokedex/:pokedexId/pokemon/:id', component: PokemonDetailsComponent, canActivate: [AuthGuard] },
    { path: 'pokedex/:pokedexId', component: PokedexComponent, canActivate: [AuthGuard] },
    { path: 'panel-admin', component: PanelAdminComponent, canActivate: [AuthGuard, AdminGuard]}
];
