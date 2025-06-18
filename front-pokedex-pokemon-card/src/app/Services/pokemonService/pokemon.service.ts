import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pokemon } from '../../Models/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private baseUrl = environment.apiUrl + '/Pokemon'

  constructor(private http: HttpClient) { }

  public getAll(): Observable<Pokemon[]>
  {
    return this.http.get<Pokemon[]>(this.baseUrl);
  }

  public getByGen(gen: number): Observable<Pokemon[]>
  {
    return this.http.get<Pokemon[]>(this.baseUrl + '/generation/' + gen);
  }

}
