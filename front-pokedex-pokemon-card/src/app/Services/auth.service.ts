import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { TokenConnect } from '../Models/tokenConnect';
import { UserConnect } from '../Models/userConnect';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.apiUrl + '/Auth';

  public userToken$ = new BehaviorSubject<string | null>(null);
  public user$ = new BehaviorSubject<UserConnect | null>(null);
  public user: UserConnect | null = null;

  constructor(private ngZone: NgZone, private http: HttpClient) {
    this.initializeGoogle();
  }

  renderGoogleButton(container: HTMLElement) {
    const g = (window as any).google;
    if (!g?.accounts?.id || !container) return;

    g.accounts.id.renderButton(container, {
      type: 'standard',
      theme: 'filled_blue',
      size: 'large',
      text: 'signin_with',
      shape: 'rectangular',
    });
  }

  getToken(): string | null {
    const currentToken = this.userToken$.getValue();
    if (currentToken) return currentToken;
    const storedToken = localStorage.getItem(
      environment.localStorageTokenString
    );
    if (storedToken) {
      this.userToken$.next(storedToken);
      return storedToken;
    }
    return null;
  }

  autoLogin() {
    const storedToken = localStorage.getItem(
      environment.localStorageTokenString
    );
    if (storedToken) {
      this.userToken$.next(storedToken);
      this.getCurrentUser().subscribe({
        next: (user) => {
          this.user$.next(user);
          this.user = user;
        },
        error: (err) => {
          localStorage.removeItem(environment.localStorageTokenString);
          this.user$.next(null);
          this.user = null;
        },
      });
    }
  }

  refreshCurrentUser() {
    this.getCurrentUser().subscribe({
      next: (user) => {
        this.user$.next(user);
        this.user = user;
      },
      error: (err) => {
        localStorage.removeItem(environment.localStorageTokenString);
        this.user$.next(null);
        this.user = null;
      },
    });
  }

  getCurrentUser(): Observable<UserConnect> {
    return this.http.get<UserConnect>(this.baseUrl + '/current-user');
  }

  logout() {
    this.userToken$.next(null);
    this.user$.next(null);
    this.user = null;
    localStorage.removeItem(environment.localStorageTokenString);
  }

  private initializeGoogle() {
    const g = (window as any).google;
    if (!g?.accounts?.id) return;

    g.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => this.handleCredentialResponse(response),
      itp_support: true,
      use_fedcm_for_prompt: true,
    });
  }

  private handleCredentialResponse(response: any) {
    this.ngZone.run(() => {
      const credential = response.credential;
      this.userToken$.next(credential);

      const tokenPayload: TokenConnect = { token: credential };
      this.http
        .post<TokenConnect>(this.baseUrl + '/google-login', tokenPayload)
        .subscribe((r) => {
          this.userToken$.next(r.token);
          localStorage.setItem(environment.localStorageTokenString, r.token);
          this.getCurrentUser().subscribe((user) => {
            this.user$.next(user);
            this.user = user;
          });
        });
    });
  }
}
