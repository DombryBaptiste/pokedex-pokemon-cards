import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pokemon } from '../../Models/pokemon';
import { PokemonFilter } from '../../Models/pokemonFilter';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private baseUrl = environment.apiUrl + '/Pokemon'

  constructor(private http: HttpClient) { }

  public getByGen(gen: number, filters?: PokemonFilter): Observable<Pokemon[]>
  {
    let params = new HttpParams();
    if(filters)
    {
      if(filters.filterHiddenActivated !== undefined)
      {
        params = params.set('filterHiddenActivated', filters.filterHiddenActivated.toString());
      }
    }
    return this.http.get<Pokemon[]>(this.baseUrl + '/generation/' + gen, { params });
  }

  public getById(id: number): Observable<Pokemon>
  {
    return this.http.get<Pokemon>(this.baseUrl + '/' + id);
  }
}
