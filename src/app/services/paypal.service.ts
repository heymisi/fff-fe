import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../common/order';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  private baseUrl = 'https://fitforfun-backend.herokuapp.com/paypal';

  constructor(private http: HttpClient) { }

  makePayment(order: Order): Promise<any> {
    return this.http.post(this.baseUrl + '/make/payment', order).toPromise();
  }

  completePayment(paymentId: string, payerId: string): Promise<any> {
    return this.http.post(this.baseUrl + '/paypal/complete/payment?paymentId=' + paymentId + '&payerId=' + payerId, { responseType: 'text' }).toPromise();
  }
}
