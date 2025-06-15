import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environment';
import { HttpClient } from '@angular/common/http';
import { TokenConnect } from '../Models/tokenConnect';
import { UserConnect } from '../Models/userConnect';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  baseUrl = environment.apiUrl + '/Auth'

  public userToken$ = new BehaviorSubject<string | null>(null);
  public user$ = new BehaviorSubject<UserConnect | null>(null);

  constructor(private ngZone: NgZone, private http: HttpClient) {
    this.initializeGoogle();
  }

  getToken(): string | null {
    const currentToken = this.userToken$.getValue();
    if (currentToken) return currentToken;
    const storedToken = localStorage.getItem(environment.localStorageTokenString);
    if (storedToken) {
      this.userToken$.next(storedToken);
      return storedToken;
    }
    return null;
  }

  autoLogin() {
    const storedToken = localStorage.getItem(environment.localStorageTokenString);
    if(storedToken)
    {
      this.userToken$.next(storedToken);
      this.getCurrentUser().subscribe({
        next: user => {
          this.user$.next(user);
        },
        error: err => {
          localStorage.removeItem(environment.localStorageTokenString);
          this.user$.next(null);
        }
      });
    }
  }


  private initializeGoogle() {
    window.onload = () => {
      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (response: any) => this.handleCredentialResponse(response),
        federated: true
      });
    };
  }

  loginWithGoogle() {
    google.accounts.id.prompt((notification: any) => {
      console.log('Prompt Google : ', notification);
    });
  }

  getCurrentUser() : Observable<UserConnect> {
    return this.http.get<UserConnect>(this.baseUrl + '/current-user');
  }

  private handleCredentialResponse(response: any) {
    this.ngZone.run(() => {
      const credential = response.credential;
      this.userToken$.next(credential);

      let tokenPayload: TokenConnect = {
        token: credential
      };
      this.http.post<TokenConnect>(this.baseUrl + '/google-login', tokenPayload).subscribe(r => {
        this.userToken$.next(r.token)
        console.log(environment.localStorageTokenString);
        localStorage.setItem(environment.localStorageTokenString, r.token);
        this.getCurrentUser().subscribe(user => { this.user$.next(user); console.log(user) });
      })
    });
  }

  logout() {
    this.userToken$.next(null);
    this.user$.next(null);
    localStorage.removeItem(environment.localStorageTokenString);
  }
}
