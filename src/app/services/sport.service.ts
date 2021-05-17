import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sport } from '../common/sport';

@Injectable({
  providedIn: 'root'
})
export class SportService {
  private baseUrl = 'http://18.193.77.12:8080/fit-for-fun/sports';

  constructor(private http: HttpClient) { }

  getSport(): Observable<Sport[]> {
    return this.http.get<Sport[]>(this.baseUrl);
  }
}
