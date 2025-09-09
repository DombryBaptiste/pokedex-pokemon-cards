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
    if(filters)
    {
      if(filters.filterGeneration !== undefined && filters.filterName === undefined)
      {
        params = params.set('filterGeneration', filters.filterGeneration);
      }
      if(filters.filterName !== undefined)
      {
        params = params.set('filterName', filters.filterName);
      }
      if(filters.pokedexId !== undefined)
      {
        params = params.set('pokedexId', filters.pokedexId);
      }
      if(filters.filterExceptWantedAndOwned !== undefined)
      {
        params = params.set('filterExceptWantedAndOwned', filters.filterExceptWantedAndOwned);
      }
      if(filters.filterExceptHasNoWantedCard !== undefined)
      {
        params = params.set('filterExceptHasNoWantedCard', filters.filterExceptHasNoWantedCard)
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

  public getAll(): Observable<Pokemon[]>
  {
    return this.http.get<Pokemon[]>(this.baseUrl);
  }

  public getAllZarbi(): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(this.baseUrl + "/zarbi");
  }
}
