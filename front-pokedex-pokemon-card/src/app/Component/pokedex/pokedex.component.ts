import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { Pokedex, PokedexCompletion, PokedexType } from '../../Models/pokedex';
import { PokedexService } from '../../Services/pokedexService/pokedex.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PokedexScrollService } from '../../Services/PokedexScrollService/pokedex-scroll.service';
import { LivingDexPokedexComponent } from '../living-dex-pokedex/living-dex-pokedex.component';
import { SpecificPokemonPokedexComponent } from '../specific-pokemon-pokedex/specific-pokemon-pokedex.component';
import { ZarbiDexComponent } from "../zarbi-dex/zarbi-dex.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ValidDialogComponent, ValidDialogData } from '../valid-dialog/valid-dialog.component';

@Component({
  selector: 'app-pokedex',
  imports: [
    LivingDexPokedexComponent,
    SpecificPokemonPokedexComponent,
    MatButtonModule,
    FormsModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
    ZarbiDexComponent,
    MatDialogModule,
  ],
  templateUrl: './pokedex.component.html',
  styleUrl: './pokedex.component.scss',
})
export class PokedexComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  genSelected: number = 1;
  pokedexId: number = 0;
  pokedex!: Pokedex;
  isPokedexOwner: boolean = false;
  completion: PokedexCompletion | null = null;

  protected readonly PokedexType = PokedexType;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    public pokedexService: PokedexService,
    private scrollService: PokedexScrollService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.pokedexId = Number(params.get('pokedexId'));
      this.initData();
    });

    this.route.queryParamMap.subscribe((params) => {
      this.genSelected = Number(params.get('gen')) || 1;
    });
  }

  handlePokemonClick(pokemonId: number): void {
    this.scrollService.scrollPosition = window.scrollY;
    this.router.navigate(['/pokedex', this.pokedexId, 'pokemon', pokemonId]);
  }

  handleShareCode() {
    if (this.pokedex) {
      navigator.clipboard.writeText(this.pokedex?.shareCode).then(() => {});
    }
  }

  getValueProgressBar() {
    if (this.completion?.maxPokemon == 0 || this.completion == null) {
      return 0;
    }
    return Math.round(
      (this.completion.ownedPokemonNb / this.completion.maxPokemon) * 100
    );
  }

  initCompletion() {
    this.pokedexService.getCompletion(this.pokedexId).subscribe((c) => {
      this.completion = c;
    });
  }

  handleSuppr() {
    let data: ValidDialogData = {
      title: 'Supprimer le pokédex',
      text: 'Voulez vous vraiment supprimé le pokédex ?',
    };

    const dialogRef = this.dialog.open(ValidDialogComponent, {
      data: data,
      panelClass: 'classic-dialog',
    });

    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.pokedexService.delete(this.pokedex.id).subscribe(() => {
          this.authService.removePokedex(this.pokedex.id);
          this.router.navigate(['/']);
        });
      }
    });
  }

  private initData() {
    this.loadUserContext();
    this.initPokedex();
    this.initCompletion();
  }

  private loadUserContext(): void {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.isPokedexOwner =
          user?.pokedexUsers.find((pokedex) => pokedex.userId == user.id)
            ?.isOwner ?? false;
      }
    });
  }

  private initPokedex(): void {
    this.pokedexService.getById(this.pokedexId).subscribe((p) => {
      this.pokedex = p;
    });
  }
}
