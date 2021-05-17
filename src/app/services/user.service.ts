import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { User } from '../common/user';
import { concatMap, map, take } from 'rxjs/operators';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { TrainingSession } from '../common/training-session';
import { LoginRequest } from '../common/login-request';
import { UserRegistrationModel } from '../common/user-registration-model';
import { PasswordResetRequestModel } from '../common/password-reset-request-model';
import { PasswordResetModel } from '../common/password-reset-model';
import { UserUpdateInTransactionModel } from '../common/user-update-in-transaction-model';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = 'http://18.193.77.12:8080/fit-for-fun/users';
  constructor(private httpClient: HttpClient) { }

  login(creds: LoginRequest) {
    return this.httpClient.post<any>('http://18.193.77.12:8080/fit-for-fun/login', creds, httpOptions);

  }
  createUser(user: UserRegistrationModel): Observable<any> {
    return this.httpClient.post<User>(this.baseUrl, user);
  }

  isEmailAlreadyUsed(email: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.baseUrl}/email-check/${email}`);
  }
  getUsers(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl);
  }
  getUser(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/${id}`);
  }
  modifyUser(id: number, user: User): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}/${id}`, user);
  }
  modifyUserDuringTransaction(id: number, user: UserUpdateInTransactionModel): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}/${id}/updateDuringTransaction`, user);
  }
  addTrainingSession(id: number, sessionId: number): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/${id}/addTrainingSession?sessionId=${sessionId}`);
  }
  changePassword(id: number, oldPass: string, newPass: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/${id}/changePass?oldPass=${oldPass}&newPass=${newPass}`);
  }
  deleteUser(id: number, pass: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${id}?pass=${pass}`);
  }
  verifyEmailToken(token: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/email-verification/?token=${token}`);
  }
  requestPasswordReset(email: PasswordResetRequestModel): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/password-reset-request`, email);
  }
  resetPassword(password: PasswordResetModel): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/password-reset`, password);
  }
}
