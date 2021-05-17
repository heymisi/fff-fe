import { HttpClient, JsonpClientBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../common/transaction';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private transactionUrl = 'http://18.193.77.12:8080/fit-for-fun/transaction/purchase';

  constructor(private httpClient: HttpClient) { }

  placeOrder(userId: number): Observable<any> {
    return this.httpClient.get<Transaction>(`${this.transactionUrl}/${userId}`);
  }
}

