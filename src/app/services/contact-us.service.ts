import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  private baseUrl = 'http://18.193.77.12:8080/fit-for-fun/email/contact-us';

  constructor(private httpClient: HttpClient) { }

  sendEmail(email: string, message: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}` + `?email=${email}&message=${message}`);
  }
}
