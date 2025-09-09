import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { PokedexComponent } from '../pokedex/pokedex.component';

@Component({
  selector: 'app-valid-dialog',
  imports: [MatDialogModule, MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions],
  templateUrl: './valid-dialog.component.html',
  styleUrl: './valid-dialog.component.scss'
})
export class ValidDialogComponent {
  readonly dialogRef = inject(MatDialogRef<PokedexComponent>);
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ValidDialogData,
  ) { }
}

export interface ValidDialogData {
  title: string;
  text: string;
}
