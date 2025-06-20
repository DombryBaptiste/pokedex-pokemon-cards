import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserConnect } from '../../Models/userConnect';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.apiUrl + '/User'

  constructor(private http: HttpClient) { }

  updateUser(user: UserConnect)
  {
    return this.http.put(this.baseUrl, user);
  }

  setPokemonVisibility(pokemonId: number, hidden: boolean)
  {
    return this.http.post(this.baseUrl + '/visibility/' + pokemonId,  { hidden });
  }
}
