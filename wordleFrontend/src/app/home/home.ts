import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  showLoginModal = false;
  isLoggedIn = false;
  isAdmin = false;
  username = '';
  password = '';
  errorMessage = '';

  adminCredentials = { username: 'admin', password: 'secret' };

  constructor() {
    const stored = localStorage.getItem('user');
    if (stored) {
      this.isLoggedIn = true;
      this.isAdmin = localStorage.getItem('isAdmin') === 'true';
    }
  }

  openLogin() {
    this.showLoginModal = true;
  }

  closeLogin() {
    this.showLoginModal = false;
  }

  login() {
    if (
      this.username === this.adminCredentials.username &&
      this.password === this.adminCredentials.password
    ) {
      localStorage.setItem('user', this.username);
      localStorage.setItem('isAdmin', 'true');
      this.isAdmin = true;
      this.isLoggedIn = true;
      this.showLoginModal = false;
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }

  loginGuest() {
    localStorage.setItem('user', 'Guest');
    localStorage.setItem('isAdmin', 'false');
    this.isLoggedIn = true;
    this.isAdmin = false;
    this.showLoginModal = false;
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    this.isLoggedIn = false;
    this.isAdmin = false;
  }
}
