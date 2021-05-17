import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  baseUrl = 'http://18.193.77.12:8080/fit-for-fun/';

  constructor(private http: HttpClient) { }

  getSportById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}sports/${id}`)
  }
  getCategoryById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}item-categories/${id}`)
  }
  getSportByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}sports/byName/${name}`)
  }
  getCategoryByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}item-categories/byName/${name}`)
  }
  getTrainingSessions(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}trainingSessions`)
  }
  getTrainingSessionsByAvailableForUser(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}trainingSessions/${userId}/byAvailableForClient`)
  }
  getTransactionItems(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}transaction/transactionItems`)
  }
  getShopItems(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}shop-items/without-filters`)
  }
}
