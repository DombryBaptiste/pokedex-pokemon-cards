import { Component, output } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  imports: [MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  

  constructor(private router: Router) { }

  handleHomeClick()
  {
    this.router.navigate(['/'])
  }
}
