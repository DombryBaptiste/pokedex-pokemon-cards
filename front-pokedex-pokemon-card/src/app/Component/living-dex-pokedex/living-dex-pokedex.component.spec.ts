import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivingDexPokedexComponent } from './living-dex-pokedex.component';

describe('LivingDexPokedexComponent', () => {
  let component: LivingDexPokedexComponent;
  let fixture: ComponentFixture<LivingDexPokedexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivingDexPokedexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivingDexPokedexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
