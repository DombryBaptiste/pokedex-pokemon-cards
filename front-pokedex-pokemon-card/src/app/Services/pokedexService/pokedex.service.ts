import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Pokedex, PokedexCreate } from '../../Models/pokedex';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PokedexService {

  baseUrl = environment.apiUrl + "/Pokedex"

  constructor(private http: HttpClient) { }

  create(pokedex: PokedexCreate)
  {
    return this.http.post<PokedexCreate>(this.baseUrl, pokedex);
  }

  getById(pokedexId: number)
  {
    return this.http.get<Pokedex>(this.baseUrl + '/' + pokedexId);
  }
}
