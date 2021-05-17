import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  baseUrl = 'http://18.193.77.12:8080/fit-for-fun/transaction';
  constructor(private httpClient: HttpClient) { }

  getTransactions(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl);
  }

  getTransactionItems(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/transactionItems");
  }

  getTransactionsByUser(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/${id}`);
  }
}
