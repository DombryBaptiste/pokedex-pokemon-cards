import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Pokedex, PokedexCompletion, PokedexCreate } from '../../Models/pokedex';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  createByShareCode(shareCode: string, userId: number): Observable<Pokedex>
  {
    const dto = {
      shareCode: shareCode,
      userId: userId
    }
    return this.http.post<Pokedex>(this.baseUrl + "/add-with-share-code", dto);
  }

  getCompletion(pokedexId: number, userId: number): Observable<PokedexCompletion>
  {
    return this.http.get<PokedexCompletion>(this.baseUrl +'/' + pokedexId + "/completion/" + userId);
  }
}
