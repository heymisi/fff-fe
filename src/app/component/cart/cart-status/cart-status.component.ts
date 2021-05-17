import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { concatMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/common/user';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  totalPrice: number = 0;
  totalQuantity: number = 0;
  constructor(private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.updateCartStatus();
  }
  updateCartStatus() {
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
    if (this.totalQuantity === 0) {
      this.authService.getUser().subscribe(user => {
        this.cartService.computeCartTotals(user);
      })
    }
  }
  onClick() {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl("/cart-details");
    } else {
      this.messageService.add({ severity: 'error', summary: 'Jelentkezz be', detail: `Kosarad csak bejelentkezés után érhető el`, life: 4000 });
    }
  }
}
