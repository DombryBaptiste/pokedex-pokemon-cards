import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Role, UserConnect } from '../../Models/userConnect';
import { AuthService } from '../../Services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { PokedexType } from '../../Models/pokedex';
import { DomSanitizer } from '@angular/platform-browser';

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

  Role = Role;
  PokedexType = PokedexType;

  constructor(
    private authService: AuthService,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.iconRegistry.addSvgIcon(
      'zarbi',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/zarbi.svg')
    );
    this.iconRegistry.addSvgIcon(
      'pokedex',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/pokedex_icon.svg')
    );
    this.iconRegistry.addSvgIcon(
      'loupe',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/loupe_pokeball.svg')
    );
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((u) => {
      console.log(u);
      this.currentUser = u
      this.titlePseudo = u?.pseudo ? u.pseudo : u?.email ?? ""
    });
  }

  handleConnexion() {
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
    this.router.navigate(['pokedex', pokedexId]);
  }

  isPokedexOwner(pokedexId: number)
  {
    return this.currentUser?.pokedexUsers.find(p => p.pokedexId == pokedexId)?.isOwner
  }

  handleStatsClick(pokedexId: number){
    this.router.navigate(['pokedex/stats', pokedexId]);
  }

  handlePanelAdmin()
  {
    this.router.navigate(['panel-admin']);
  }

  getIconPokedex(type: PokedexType): string {
    switch (type) {
      case PokedexType.LivingDex:
        return 'pokedex';
      case PokedexType.SpecificPokemonsDex:
        return 'loupe';
      case PokedexType.ZarbiDex:
        return 'zarbi';
      default:
        return 'help_outline';
    }
  }
}
