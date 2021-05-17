import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { Location } from '@angular/common';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';
import { CommentEntity } from 'src/app/common/comment-entity';
import { TransactionItem } from 'src/app/common/transaction-item';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentAddedDialogComponent } from '../../dialogs/comment-added-dialog/comment-added-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { concatMap } from 'rxjs/operators';
import { CommentRequestModel } from 'src/app/common/comment-request-model';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/common/user';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {

  product: Product;
  commentForm: FormGroup;
  submitted: Boolean = false;
  quantity: number = 1;
  isLoggedIn: Boolean = false;
  user: User = null;
  
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private _location: Location,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {
    this.product = new Product();
  }

  ngOnInit(): void {
    this.isLoggedInCheck();
    this.getUser();
    this.createForm();
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    })
  }

  handleProductDetails() {
    const productId: number = +this.route.snapshot.paramMap.get('id');
    this.productService.getProduct(productId).pipe(concatMap(
      data => {
        this.product = data.payload;
        return new Promise(resolve => setTimeout(() => resolve(data), 500));
      }
    )).subscribe((value: any) => {
      this.userService.getUsers().subscribe(data => {
        data.forEach(user => {
          for (let i = 0; i < this.product.comments.length; i++) {
            if (this.product.comments[i].commenter === user.id) {
              this.product.comments[i].commenter = user;
            }
          }
        })
      })
    })
  }

  isLoggedInCheck() {
    if (this.authService.isLoggedIn()) this.isLoggedIn = true;
  }
  getUser() {
    if (this.isLoggedIn) {
      this.authService.getUser().subscribe(data => {
        this.user = data;
      })
    }
  }

  addToCart() {
    if (this.isLoggedIn) {
      const cartItem = new TransactionItem();
      cartItem.shopItem = this.product;
      cartItem.quantity = this.quantity;
      this.cartService.addToCart(cartItem);
      this.messageService.add({ severity: 'success', summary: 'Kosárba helyezve', detail: `${this.product.name} sikeresen hozzáadva a kosarához!`, life: 5000 });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Jelentkezz be', detail: `Termék kosárba helyezése csak bejelentkezés után érhető el`, life: 4000 });
    }
  }

  onBack() {
    this._location.back();
  }

  onComment() {
    this.submitted = true;
    if (this.commentForm.invalid) {
      return false;
    } else {
      let comment = new CommentRequestModel(this.message.value, this.rate.value, +this.user.id)
      this.productService.addComment(+this.product.id, comment).subscribe(data => {
        if (data.payload === "ALREADY_COMMENTED") {
          this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Ezt a terméket egyszer már értékelted!', life: 5000 });
        } else {

          this.messageService.add({ severity: 'success', summary: 'Értékelés hozzá lett adva', detail: 'Köszönjük értékelését', life: 5000 });
          this.route.paramMap.subscribe(() => {
            this.handleProductDetails();
          })
        }
        this.commentForm.reset();
        this.message.setErrors(null);
        this.rate.setErrors(null);
      });

    }
  }

  createForm() {
    this.commentForm = this.formBuilder.group({
      message: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      rate: ['', [Validators.required]]
    });
  }

  get message() { return this.commentForm.get('message'); }
  get rate() { return this.commentForm.get('rate'); }

  decrementQuantity() {
    if (this.quantity === 0) {
      return;
    }
    this.quantity--;
  }

  incrementQuantity() {
    this.quantity++;
  }

  onCartClick() {
    if (this.isLoggedIn) {
      this.router.navigateByUrl("/cart-details");
    } else {
      this.messageService.add({ severity: 'error', summary: 'Jelentkezz be', detail: 'Kosár megtekintéséhez előbb jelentkezz be!', life: 5000 });
    }
  }
}
