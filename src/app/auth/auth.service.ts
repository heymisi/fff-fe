import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { User } from '../common/user';
import { UserService } from '../services/user.service';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private tokenStorageService: TokenStorageService, private userService: UserService) {
  }
  isLoggedIn(): boolean {
    if (this.tokenStorageService.getToken()) return true;
    return false;
  }
  signOut() {
    this.tokenStorageService.signOut();
  }
  getUserId(): string {
    return this.tokenStorageService.getUserId();
  }
  getUser(): Observable<User> {
    var subject = new Subject<any>();
    this.userService.getUser(+this.getUserId()).subscribe(data => {
      subject.next(data.payload);
    })
    return subject.asObservable();
  }
  isAdmin(): boolean {
    if (!this.tokenStorageService.getToken()) return false;
    if (this.tokenStorageService.getAuthorities() === 'ROLE_ADMIN') return true;
    return false;
  }
  isInstructor(): boolean {
    if (!this.tokenStorageService.getToken()) return false;
    if (this.tokenStorageService.getAuthorities() === 'ROLE_INSTRUCTOR') return true;
    return false;
  }
  isUser(): boolean {
    if (!this.tokenStorageService.getToken()) return false;
    if (this.tokenStorageService.getAuthorities() === 'ROLE_USER') return true;
    return false;
  }
  getAuthority(): string {
    if (!this.tokenStorageService.getToken()) return 'guest';
    let role = this.tokenStorageService.getAuthorities()
    if (role === 'ROLE_ADMIN') return 'admin'
    else if (role === 'ROLE_INSTRUCTOR') return 'instructor'
    else return 'user';
  }
}
