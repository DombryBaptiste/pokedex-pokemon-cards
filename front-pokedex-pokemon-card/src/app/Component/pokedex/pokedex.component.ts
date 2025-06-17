import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-pokedex',
  imports: [MatButtonModule],
  templateUrl: './pokedex.component.html',
  styleUrl: './pokedex.component.scss'
})

export class PokedexComponent {
  generations = [1, 2, 3, 4, 5, 6, 7, 8, 9];
}
