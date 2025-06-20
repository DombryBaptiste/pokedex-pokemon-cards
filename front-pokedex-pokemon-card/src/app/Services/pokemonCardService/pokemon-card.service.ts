import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { Observable } from 'rxjs';
import { PokemonCard } from '../../Models/pokemonCard';

@Injectable({
  providedIn: 'root'
})
export class PokemonCardService {

  private baseUrl = environment.apiUrl + '/PokemonCard'

  constructor(private http: HttpClient) { }

  getAllByPokemonId(pokemonId: number): Observable<PokemonCard[]>
  {
    return this.http.get<PokemonCard[]>(this.baseUrl + "/" + pokemonId);
  }
}
