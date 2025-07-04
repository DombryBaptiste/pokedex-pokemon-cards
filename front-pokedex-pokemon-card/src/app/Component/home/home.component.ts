import { Component, OnInit } from '@angular/core';
import { UserConnect } from '../../Models/userConnect';
import { AuthService } from '../../Services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatTooltipModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  currentUser: UserConnect | null = null;

  titlePseudo: string = "";

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.user$.subscribe((u) => {
      this.currentUser = u
      this.titlePseudo = u?.pseudo ? u.pseudo : u?.email ?? ""
  })
  }

  handleConnexion()
  {
    this.authService.loginWithGoogle();
  }

  handleProfileClick()
  {
    this.router.navigate(['/profile']);
  }

  handleAddPokedex()
  {
    this.router.navigate(['/pokedex/create']);
  }

  handlePokedexClick(pokedexId: number)
  {
    this.router.navigate(['pokedex', pokedexId, 1]);
  }

  isPokedexOwner(pokedexId: number)
  {
    return this.currentUser?.pokedexUsers.find(p => p.pokedexId == pokedexId)?.isOwner
  }

  handleStatsClick(pokedexId: number){
    this.router.navigate(['pokedex/stats', pokedexId]);
  }
}
