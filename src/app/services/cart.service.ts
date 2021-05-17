import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { TransactionItem } from '../common/transaction-item';
import { TransactionItemRequestModel } from '../common/transaction-item-request-model';
import { User } from '../common/user';
const TOTAL_PRICE = 'total_price';
const TOTAL_QUANTITY = 'total_quantity';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: TransactionItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  user: User = null;
  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  addToCart(cartItem: TransactionItem) {
    //check if we already have in the cart
    this.authService.getUser().pipe(concatMap(loggedInUser => {
      this.user = loggedInUser;
      return new Promise(resolve => setTimeout(() => resolve(loggedInUser), 500));
    })).subscribe(value => {
      this.addItemToCart(+this.user.id, new TransactionItemRequestModel(+cartItem.shopItem.id, cartItem.quantity, cartItem.price)).subscribe(
        data => {
          this.computeCartTotals(data);
        }
      )
    })
  }

  computeCartTotals(user: any) {
    this.totalPrice.next(user.cart.totalPrice);
    this.totalQuantity.next(user.cart.cartItemQuantity);
  }

  remove(userId: number, itemId: number) {
    return this.httpClient.get<any>(`http://18.193.77.12:8080/fit-for-fun/cart/${userId}/deleteFromCart/${itemId}`);
  }
  addItemToCart(userId: number, item: TransactionItemRequestModel): Observable<any> {
    return this.httpClient.post<any>(`http://18.193.77.12:8080/fit-for-fun/cart/addToCart/${userId}`, item);
  }
  incrementQuantity(cartItemId: number): Observable<any> {
    return this.httpClient.get<any>(`http://18.193.77.12:8080/fit-for-fun/cart/${cartItemId}/incrementTransactionItemQuantity`);
  }
  decrementQuantity(cartItemId: number): Observable<any> {
    return this.httpClient.get<any>(`http://18.193.77.12:8080/fit-for-fun/cart/${cartItemId}/decrementTransactionItemQuantity`);
  }
}
