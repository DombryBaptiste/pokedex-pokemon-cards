import { TestBed } from '@angular/core/testing';

import { PokemonUtilsService } from './pokemon-utils.service';

describe('PokemonUtilsService', () => {
  let service: PokemonUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokemonUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
