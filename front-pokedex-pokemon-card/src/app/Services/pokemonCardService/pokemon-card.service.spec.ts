import { TestBed } from '@angular/core/testing';

import { PokemonCardService } from './pokemon-card.service';

describe('PokemonCardService', () => {
  let service: PokemonCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokemonCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
