import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sport } from '../common/sport';

@Injectable({
  providedIn: 'root'
})
export class SportService {
  private baseUrl = 'https://fitforfun-backend.herokuapp.com/sports';

  constructor(private http: HttpClient) { }

  getSport(): Observable<Sport[]> {
    return this.http.get<Sport[]>(this.baseUrl);
  }
}
