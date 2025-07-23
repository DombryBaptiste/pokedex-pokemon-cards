import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {}

  private openSnackBar(message: string, panelClass: string, duration: number = 2000) {
    const config: MatSnackBarConfig = {
      duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass
    };
    this.snackBar.open(message, 'Fermer', config);
  }

  showSuccess(message: string) {
    this.openSnackBar(message, 'snackbar-success');
  }

  showError(message: string) {
    this.openSnackBar(message, 'snackbar-error');
  }

  showInfo(message: string) {
    this.openSnackBar(message, 'snackbar-info');
  }
}
