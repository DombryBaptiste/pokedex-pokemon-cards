import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PokemonUtilsService {

  constructor() { }

  public getFullImageUrl(relativePath: string): string {
    return environment.apiUrl + relativePath;
  }

  public formatPokedexId(id: number): string {
    return '#' + id.toString().padStart(3, '0');
  }
}
