import { Component, HostListener } from '@angular/core';
import { TopbarComponent } from "./Component/topbar/topbar.component";
import { CommonModule } from '@angular/common';
import { AuthService } from './Services/auth.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet ,TopbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'front-pokedex-pokemon-card';

  isSidebarVisible: boolean = false;

  constructor(private authService: AuthService)
  {
    this.authService.autoLogin();
  }
  
}
