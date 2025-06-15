import { Component } from '@angular/core';
import { TopbarComponent } from "./Component/topbar/topbar.component";
import { SidebarComponent } from "./Component/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { AuthService } from './Services/auth.service';

@Component({
  selector: 'app-root',
  imports: [TopbarComponent, SidebarComponent, CommonModule],
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
