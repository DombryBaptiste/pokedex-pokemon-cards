import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Pokemon } from '../../Models/pokemon';
import { PokemonFilter } from '../../Models/pokemonFilter';
import { PokemonUtilsService } from '../pokemonUtilsService/pokemon-utils.service';
import { PokemonCard } from '../../Models/pokemonCard';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private baseUrl = environment.apiUrl + '/Pokemon'

  constructor(private http: HttpClient, private pokemonUtilsService: PokemonUtilsService) { }

  public getFiltered(filters?: PokemonFilter): Observable<Pokemon[]>
  {
    let params = new HttpParams();
    console.log(filters);
    if(filters)
    {
      if(filters.filterGeneration !== undefined && filters.filterName === undefined)
      {
        params = params.set('filterGeneration', filters.filterGeneration);
      }
      if(filters.filterHiddenActivated !== undefined)
      {
        params = params.set('filterHiddenActivated', filters.filterHiddenActivated.toString());
      }
      if(filters.filterName !== undefined)
      {
        params = params.set('filterName', filters.filterName);
      }
    }
    
    return this.http.get<Pokemon[]>(this.baseUrl + '/filtered', { params }).pipe(
      map((pokemons: Pokemon[]) => 
        pokemons.map((pk: Pokemon) => ({
          ...pk,
          imagePath: this.pokemonUtilsService.getFullImageUrl(pk.imagePath)
        })))
    );
  }

  public getById(id: number): Observable<Pokemon>
  {
    return this.http.get<Pokemon>(this.baseUrl + '/' + id).pipe(
      map((pokemon: Pokemon) => {
        pokemon.imagePath = this.pokemonUtilsService.getFullImageUrl(pokemon.imagePath);

        pokemon.pokemonCards = pokemon.pokemonCards.map((c: PokemonCard) => ({
          ...c,
          image: this.pokemonUtilsService.getFullImageUrl(c.image)
        }));

        return pokemon;
      })
    );
  }
}
