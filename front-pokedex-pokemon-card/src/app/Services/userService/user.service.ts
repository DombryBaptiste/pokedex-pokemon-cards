import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
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
}
