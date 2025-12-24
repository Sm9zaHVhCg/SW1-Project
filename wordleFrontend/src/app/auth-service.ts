import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private loginUrl = 'https://vsv-research.volkmann-webservices.de/auth/login';
  private verifyUrl = 'https://vsv-research.volkmann-webservices.de/auth/verify?token=';
  private addUserUrl = 'http://localhost:8080/user/new?username=';
  private isAdminUrl = 'http://localhost:8080/user/is-admin?username=';
  private guestUrl = 'http://localhost:8080/user/new-guest';

  constructor(private http: HttpClient) {
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(this.loginUrl, {username, password});
  }

  verify(token: string): Observable<{ valid: boolean, user: string }> {
    return this.http.get<{ valid: boolean, user: string}>(this.verifyUrl + token);
  }

  //add user if hasnt been added yet to wordle db
  addUser(username: string): Observable<any> {
    return this.http.post(this.addUserUrl + username, {});
  }

  isAdmin(username: string): Observable<{ isAdmin: boolean }> {
    return this.http.get<{ isAdmin: boolean }>(this.isAdminUrl + username);
  }

  loginGuest(): Observable<any> {
    return this.http.post(this.guestUrl, {});
  }

}
