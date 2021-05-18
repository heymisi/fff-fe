import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  private baseUrl = 'https://fitforfun-backend.herokuapp.com/email/contact-us';

  constructor(private httpClient: HttpClient) { }

  sendEmail(email: string, message: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}` + `?email=${email}&message=${message}`);
  }
}
