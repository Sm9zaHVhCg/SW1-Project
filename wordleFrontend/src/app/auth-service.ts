import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ConfigService} from './config.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient, private config: ConfigService) {
  }

  private loginUrl = 'https://vsv-research.volkmann-webservices.de/auth/login';
  private verifyUrl = 'https://vsv-research.volkmann-webservices.de/auth/verify?token=';

  login(username: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(this.loginUrl, {username, password});
  }

  verify(token: string): Observable<{ valid: boolean, user: string }> {
    return this.http.get<{ valid: boolean, user: string}>(this.verifyUrl + token);
  }

  //add user if hasnt been added yet to wordle db
  addUser(username: string): Observable<any> {
    return this.http.post(`${this.config.apiUrl}/user/new?username=` + username, {});
  }

  isAdmin(username: string): Observable<{ isAdmin: boolean }> {
    return this.http.get<{ isAdmin: boolean }>(`${this.config.apiUrl}/user/is-admin?username=` + username);
  }

  loginGuest(): Observable<any> {
    return this.http.post(`${this.config.apiUrl}/user/new-guest`, {});
  }

}
