import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { UserConnect } from '../../Models/userConnect';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../Services/userService/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  currentUser: UserConnect | null = null;

  constructor(private authService: AuthService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(u => this.currentUser = u);
  }

  handleSave()
  {
    if(this.currentUser != null)
    {
      this.userService.updateUser(this.currentUser).subscribe();
    }
  }

  handleLogout()
  {
    this.authService.logout();
    this.router.navigate(['/'])
  }
}
