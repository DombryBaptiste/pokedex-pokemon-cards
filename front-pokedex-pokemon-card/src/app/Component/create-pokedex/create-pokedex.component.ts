import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PokedexCreate } from '../../Models/pokedex';
import { PokedexService } from '../../Services/pokedexService/pokedex.service';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-create-pokedex',
  imports: [MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule],
  templateUrl: './create-pokedex.component.html',
  styleUrl: './create-pokedex.component.scss',
})
export class CreatePokedexComponent implements OnInit {
  pokedex: PokedexCreate = {
    name: '',
    userId: 0,
  };

  shareCode: string = "";

  constructor(
    private pokedexService: PokedexService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((u) => {
      if (u) {
        this.pokedex.userId = u.id;
      }
    });
  }

  handleCreate() {
    if (this.pokedex.name != '' && this.pokedex.name.trim() !== '') {
      this.pokedexService.create(this.pokedex).subscribe(() => {
        this.authService.refreshCurrentUser();
      });
    }
  }

  handleAdd()
  {
    this.authService.user$.subscribe(user => {
      if(user == null) { return; }
      this.pokedexService.createByShareCode(this.shareCode, user?.id).subscribe(pokedex => {
        console.log("Pokedex");
      })
    })
    
  }
}
