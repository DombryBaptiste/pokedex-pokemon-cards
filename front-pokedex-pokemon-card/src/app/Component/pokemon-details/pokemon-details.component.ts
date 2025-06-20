import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pokemon } from '../../Models/pokemon';
import { PokemonService } from '../../Services/pokemonService/pokemon.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PokemonUtilsService } from '../../Services/pokemonUtilsService/pokemon-utils.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../Services/userService/user.service';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-pokemon-details',
  imports: [CommonModule ,MatIconModule, MatButtonModule, MatCheckboxModule, FormsModule],
  templateUrl: './pokemon-details.component.html',
  styleUrl: './pokemon-details.component.scss'
})
export class PokemonDetailsComponent implements OnInit {

  pokemonId: number = 0;
  pokemon: Pokemon | null = null;
  hide: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private pokemonService: PokemonService, public pokemonUtilsService: PokemonUtilsService, private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    if(id != null)
    {
      this.pokemonId = parseInt(id);
      this.initPokemon();
    }
    
  }

  handleBackPokedex()
  {
    this.router.navigate(['/pokedex', this.pokemon?.generation]);
  }

  onToggleVisibility(checked: boolean) {
    this.hide = checked;
    this.userService.setPokemonVisibility(this.pokemon!.pokedexId, checked).subscribe(() => {
      this.authService.getCurrentUser().subscribe((user) => this.authService.user$.next(user));
    });
  }

  private initPokemon() {
    this.pokemonService.getById(this.pokemonId).subscribe(pk => {
      this.pokemon = pk
      this.pokemon.imagePath = this.pokemonUtilsService.getFullImageUrl(pk.imagePath);

      this.authService.user$.subscribe(u => {
        if(u && u.hiddenPokemonIds) {
          this.hide = u.hiddenPokemonIds.includes(pk.id);
        } else {
          this.hide = false;
        }
      });
    });
  }

}
