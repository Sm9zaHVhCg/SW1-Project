import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../auth-service';

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

  constructor(private auth: AuthService) {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (user && token) {
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
    this.errorMessage = '';

    this.auth.login(this.username, this.password).subscribe({
      next: (response) => {
        const token = response.access_token;
        localStorage.setItem('token', token);

        // Step 2: verify token
        this.auth.verify(token).subscribe({
          next: (verifyResponse) => {
            if (!verifyResponse.valid) {
              this.errorMessage = 'Invalid token returned by server';
              this.password = '';
              return;
            }

            const username = verifyResponse.user;
            localStorage.setItem('user', username);

            // Step 3: add user to Wordle DB if missing
            this.auth.addUser(username).subscribe({
              next: () => {
                // Step 4: check admin status
                this.auth.isAdmin(username).subscribe({
                  next: (adminResponse) => {
                    const isAdmin = adminResponse.isAdmin;
                    localStorage.setItem('isAdmin', String(isAdmin));

                    // Step 5: update UI state
                    this.isLoggedIn = true;
                    this.isAdmin = isAdmin;
                    this.showLoginModal = false;
                    this.errorMessage = '';
                    this.password = '';
                  },
                  error: () => {
                    this.errorMessage = 'Failed to check admin status';
                    this.password = '';
                  }
                });
              },
              error: () => {
                this.errorMessage = 'ERROR ADDING USER';
                this.password = '';
              }
            });
          },
          error: () => {
            this.errorMessage = 'Token verification failed';
            this.password = '';
          }
        });
      },
      error: () => {
        this.errorMessage = 'Invalid username or password';
        this.password = '';
      }
    });
  }

  loginGuest() {
    this.auth.loginGuest().subscribe({
      next: (guestResponse) => {
        localStorage.setItem('user', guestResponse.user);
        localStorage.setItem('isAdmin', 'false');
      },
      error: () => {
        this.errorMessage = 'Failed to create guest user';
      }
    });

    this.isLoggedIn = true;
    this.isAdmin = false;
    this.showLoginModal = false;
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.isAdmin = false;
  }
}
