import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PokedexCreate, PokedexType } from '../../Models/pokedex';
import { PokedexService } from '../../Services/pokedexService/pokedex.service';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../Services/auth.service';
import { UserConnect } from '../../Models/userConnect';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-create-pokedex',
  imports: [MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule, MatSelectModule],
  templateUrl: './create-pokedex.component.html',
  styleUrl: './create-pokedex.component.scss',
})
export class CreatePokedexComponent implements OnInit {
  pokedex: PokedexCreate = {
    name: '',
    userId: 0,
    type: PokedexType.LivingDex
  };

  shareCode: string = "";

  pokedexTypes = [
    { value: PokedexType.LivingDex, label: "LivingDex" },
    { value: PokedexType.SpecificPokemonsDex, label: "Specific Pokémon" },
  ];

  private user: UserConnect | null = null;

  constructor(
    private pokedexService: PokedexService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((u) => {
      this.user = u;
    });
  }

  handleCreate() {
    this.pokedex.userId = this.user?.id ?? 0;

    if (this.pokedex.name != '' && this.pokedex.name.trim() !== '') {
      this.pokedexService.create(this.pokedex).subscribe(() => {
        this.authService.refreshCurrentUser();
        this.router.navigate(["/"]);
      });
    }
  }

  handleAdd()
  {
    if(this.user == null) { return; }
      this.pokedexService.createByShareCode(this.shareCode, this.user.id).subscribe(pokedex => {
        this.router.navigate(["/"]);
      });
  }
}
