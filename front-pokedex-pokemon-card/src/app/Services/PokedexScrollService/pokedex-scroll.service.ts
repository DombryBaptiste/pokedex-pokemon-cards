import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PokedexScrollService {

  scrollPosition: number = 0;

  constructor() { }
}
