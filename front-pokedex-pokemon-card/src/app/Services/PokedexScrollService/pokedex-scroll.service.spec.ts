import { TestBed } from '@angular/core/testing';

import { PokedexScrollService } from './pokedex-scroll.service';

describe('PokedexScrollService', () => {
  let service: PokedexScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokedexScrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
