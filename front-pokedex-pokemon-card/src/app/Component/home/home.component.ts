import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('gsiBtn', { static: false }) gsiBtn!: ElementRef<HTMLDivElement>;

  currentUser: UserConnect | null = null;

  titlePseudo: string = "";

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.user$.subscribe((u) => {
      this.currentUser = u
      this.titlePseudo = u?.pseudo ? u.pseudo : u?.email ?? ""
    });
  }

  ngAfterViewInit(): void {
    const tryRender = () => {
      if (this.gsiBtn?.nativeElement) {
        this.authService.renderGoogleButton(this.gsiBtn.nativeElement);
      }
    };

    const g = (window as any).google;
    if (g?.accounts?.id) {
      tryRender();
    } else {
      (window as any).onGoogleLibraryLoad = tryRender;
    }
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
