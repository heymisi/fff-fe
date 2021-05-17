import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { CartItem } from 'src/app/common/cart-item';
import { TransactionItem } from 'src/app/common/transaction-item';
import { CartService } from 'src/app/services/cart.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/common/user';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormValidators } from 'src/app/validators/form-validators';
import { PaypalService } from 'src/app/services/paypal.service';
import { Order } from 'src/app/common/order';
import { Transaction } from 'src/app/common/transaction';
import { CheckoutService } from 'src/app/services/checkout.service';
import { MatStepper } from '@angular/material/stepper';
import { AuthService } from 'src/app/auth/auth.service';
import { concatMap } from 'rxjs/operators';
import { UtilService } from 'src/app/services/util.service';
import { Product } from 'src/app/common/product';
import { City } from 'src/app/common/city';
import { FormService } from 'src/app/services/form.service';
import { UserUpdateInTransactionModel } from 'src/app/common/user-update-in-transaction-model';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class CartDetailsComponent implements OnInit {
  cartFormGroup: FormGroup;
  cartItems: TransactionItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  user: User = null;
  progressBarVisible: boolean = false;
  shopItems: Product[] = [];

  cities: City[] = [];
  selectedCity: any;
  filteredCities: City[];

  constructor(private cartService: CartService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private paypalService: PaypalService,
    private checkoutService: CheckoutService,
    private authService: AuthService,
    private utilService: UtilService,
    private confirmationService: ConfirmationService,
    private formService: FormService
  ) { }

  ngOnInit(): void {
    this.progressBarVisible = true;
    this.getCities();

    this.geData();
    this.cartFormGroup = this.formBuilder.group({
      name: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required, Validators.minLength(2), FormValidators.notOnlyWhitespace]),
        lastName: new FormControl('',
          [Validators.required, Validators.minLength(2), FormValidators.notOnlyWhitespace]),
      }),
      contact: this.formBuilder.group({
        email: [null, {
          validators: [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
        }],
        mobile: new FormControl('', [Validators.required, Validators.min(100000000), Validators.max(999999999)])
      }),
      address: this.formBuilder.group({
        street: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
      })
    })

  }

  get firstName() { return this.cartFormGroup.get('name.firstName'); }
  get lastName() { return this.cartFormGroup.get('name.lastName'); }
  get email() { return this.cartFormGroup.get('contact.email'); }
  get mobile() { return this.cartFormGroup.get('contact.mobile'); }
  get street() { return this.cartFormGroup.get('address.street'); }
  get city() { return this.cartFormGroup.get('address.city'); }

  filterCity(event) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < this.cities.length; i++) {
      let city = this.cities[i].cityName;
      if (city.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(this.cities[i]);
      }
    }
    this.filteredCities = filtered;
  }

  getCities() {
    this.formService.getCities().subscribe(
      data => {
        this.cities = data;
      }
    );
  }

  quantityChange(cartItem: any, prevVal: number, val: any) {
    if (val === 0) {
      this.remove(cartItem);
    } else if (prevVal > val) {
      cartItem.quantity--;
      this.decremantQuantity(cartItem);
    } else {
      cartItem.quantity++;
      this.incrementQuantity(cartItem);
    }
  }

  incrementQuantity(cartItem: TransactionItem) {
    this.cartService.incrementQuantity(cartItem.id).subscribe(data => {
      this.computeQuantityChangeValue(data);
    })
  }

  decremantQuantity(cartItem: TransactionItem) {
    this.cartService.decrementQuantity(cartItem.id).subscribe(data => {
      this.computeQuantityChangeValue(data);
    });
  }

  computeQuantityChangeValue(data: any) {
    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i].id === data.payload.id) {
        this.cartItems[i] = data.payload;
        this.shopItems.forEach(shopItem => {
          if (this.cartItems[i].shopItem === shopItem.id) {
            this.cartItems[i].shopItem = shopItem;
            return;
          }
        })
      }
    }
    this.authService.getUser().subscribe(loggedInUser => {
      this.cartService.computeCartTotals(loggedInUser);
      this.cartService.totalPrice.subscribe(
        data => this.totalPrice = data
      );
    })
  }

  remove(cartItem: TransactionItem) {
    this.confirmationService.confirm({
      message: 'Biztos benne, hogy törölni szeretné a kosarából ezt a terméket?',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cartService.remove(+this.user.id, cartItem.id).subscribe(data => {
          this.cartItems = this.cartItems.filter(val => val.id !== cartItem.id);
        });
        location.reload();
      },
      reject: () => {
        cartItem.quantity = 1;
        location.reload();
      }
    });

  }
  geData() {
    this.authService.getUser().pipe(concatMap(loggedInUser => {
      this.user = loggedInUser;
      return new Promise(resolve => setTimeout(() => resolve(loggedInUser), 500));
    })).subscribe(value => {
      this.utilService.getTransactionItems().pipe(concatMap(trItems => {
        trItems.forEach(trItem => {
          for (let i = 0; i < this.user.cart.transactionItems.length; i++) {
            if (this.user.cart.transactionItems[i] === trItem.id) {
              this.user.cart.transactionItems[i] = trItem;
            }
          }
        })
        return new Promise(resolve => setTimeout(() => resolve(trItems), 500));
      })).subscribe(value => {
        this.utilService.getShopItems().subscribe(items => {
          this.shopItems = items;
          items.forEach(item => {
            for (let i = 0; i < this.user.cart.transactionItems.length; i++) {
              if (this.user.cart.transactionItems[i].shopItem === item.id) {
                this.user.cart.transactionItems[i].shopItem = item
              }
            }
          })
        })
        this.cartItems = this.user.cart.transactionItems;
        this.totalPrice = this.user.cart.totalPrice;
        this.progressBarVisible = false;
      }
      )
    })
  }
  
  callPaypal(stepper: MatStepper) {
    if (this.cartFormGroup.invalid) {
      this.cartFormGroup.markAllAsTouched();
      return;
    }
    this.updateUser();
    stepper.next();
    this.cartItems.forEach(item => {
      item.shopItem.transactionItems = [];
    })
    const order = new Order(this.totalPrice);
    let transaction: Transaction = new Transaction(this.totalPrice, this.cartItems);
    this.progressBarVisible = true;
    this.checkoutService.placeOrder(+this.user.id).subscribe();
    this.paypalService.makePayment(order).then(
      value => window.location.href = value.redirect_url);
  }

  updateUser() {
    if (this.cartFormGroup.dirty) {
      let userModelForUpdate = new UserUpdateInTransactionModel;
      userModelForUpdate.firstName = this.firstName.value;
      userModelForUpdate.lastName = this.lastName.value;
      userModelForUpdate.email = this.email.value;
      userModelForUpdate.telNumber = this.mobile.value;
      userModelForUpdate.street = this.street.value;
      userModelForUpdate.city = this.city.value.cityName;
      this.userService.modifyUserDuringTransaction(+this.user.id, userModelForUpdate).subscribe();
    }
  }

}
