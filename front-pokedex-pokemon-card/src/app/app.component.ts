import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

declare const google: any;  // pour l’API Google Identity

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Login with Google</h1>
    <div id="g_id_onload"
         data-client_id="TON_CLIENT_ID_GOOGLE"
         data-callback="handleCredentialResponse">
    </div>
    <div id="buttonDiv"></div>

    <p *ngIf="jwtToken">Token JWT Google récupéré :</p>
    <textarea cols="80" rows="6" readonly>{{ jwtToken }}</textarea>
  `
})
export class AppComponent implements OnInit {
  jwtToken: string | null = null;

  ngOnInit() {
    // Initialise le bouton Google
    google.accounts.id.initialize({
      client_id: '726008052813-kfj2pvtbv9ubn6d4c51loi8fotspj41s.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response)
    });

    google.accounts.id.renderButton(
      document.getElementById('buttonDiv'),
      { theme: 'outline', size: 'large' }  // options du bouton
    );

    // Optionnel : affiche automatiquement le prompt de connexion
    // google.accounts.id.prompt();
  }

  handleCredentialResponse(response: any) {
    console.log('Encoded JWT ID token: ' + response.credential);
    this.jwtToken = response.credential;
  }
}
