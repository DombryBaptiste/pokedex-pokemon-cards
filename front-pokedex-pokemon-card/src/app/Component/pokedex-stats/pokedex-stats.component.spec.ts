import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokedexStatsComponent } from './pokedex-stats.component';

describe('PokedexStatsComponent', () => {
  let component: PokedexStatsComponent;
  let fixture: ComponentFixture<PokedexStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokedexStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokedexStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
