import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PokemonUtilsService {

  constructor() { }

  public getFullImageUrl(relativePath: string): string {
    console.log(environment.storageCardImage);
    console.log(relativePath);
    console.log("---")
    return environment.storageCardImage + relativePath;
  }

  public formatPokedexId(id: number): string {
    return '#' + id.toString().padStart(3, '0');
  }
}
