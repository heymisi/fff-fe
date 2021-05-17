
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { DateService } from './date.service';
import { LoginRespond } from '../common/login-respond';
import { LoginRequest } from '../common/login-request';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient, private dateService: DateService) {
  }
  login(email: string, password: string): Observable<LoginRespond> {
    let loginRequest: LoginRequest = { email: email, password: password };

    return this.http.post<LoginRespond>('http://18.193.77.12:8080/fit-for-fun/users/login',
      loginRequest).pipe(
        tap((resp: LoginRespond) => this.setSession(resp)),
        shareReplay()
      );
  }
  private setSession(authResult: LoginRespond) {
    const expiresAt = authResult.expirationDate;

    localStorage.setItem('id_token', authResult.token);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
  }
  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
  }
  public isLoggedIn(): boolean {
    return Date.now() < this.getExpiration();
  }
  isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }
  getExpiration(): number {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return expiresAt;
  }
}
