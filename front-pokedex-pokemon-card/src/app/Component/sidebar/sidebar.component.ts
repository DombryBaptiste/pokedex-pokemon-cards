import { Component, input, OnInit, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { slideInOutAnimation } from './sidebat.animations';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../Services/auth.service';
import { UserConnect } from '../../Models/userConnect';
import { Router } from '@angular/router'

@Component({
  selector: 'app-sidebar',
  imports: [MatIconModule, MatButtonModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  animations: [
    slideInOutAnimation
  ]
})
export class SidebarComponent implements OnInit {

  closeSideBar = output();
  isOpen = input(false);

  token: string | null = null;
  user: UserConnect | null = null;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.token = this.authService.getToken();

    this.authService.userToken$.subscribe(t => this.token = t);
    this.authService.user$.subscribe(u => this.user = u);
  }

  handleCloseSideBar()
  {
    this.closeSideBar.emit();
  }

  handleConnexion()
  {
    this.authService.loginWithGoogle();
  }

  handleLogOut()
  {
    this.authService.logout();
  }

  handleProfileClick(){
    this.router.navigate(['/profile']);
    this.closeSideBar.emit();
  }

  handlePokedexClick()
  {
    this.router.navigate(['pokedex', 1]);
    this.closeSideBar.emit();
  }
}
