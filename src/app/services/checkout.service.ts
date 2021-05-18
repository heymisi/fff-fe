import { HttpClient, JsonpClientBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../common/transaction';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private transactionUrl = 'https://fitforfun-backend.herokuapp.com/transaction/purchase';

  constructor(private httpClient: HttpClient) { }

  placeOrder(userId: number): Observable<any> {
    return this.httpClient.get<Transaction>(`${this.transactionUrl}/${userId}`);
  }
}

