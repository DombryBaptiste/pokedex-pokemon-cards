import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePokedexComponent } from './create-pokedex.component';

describe('CreatePokedexComponent', () => {
  let component: CreatePokedexComponent;
  let fixture: ComponentFixture<CreatePokedexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePokedexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePokedexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
