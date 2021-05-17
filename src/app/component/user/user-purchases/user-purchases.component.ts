import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { concatMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { ProductSave } from 'src/app/common/product-save';
import { Transaction } from 'src/app/common/transaction';
import { TransactionItem } from 'src/app/common/transaction-item';
import { User } from 'src/app/common/user';
import { ProductService } from 'src/app/services/product.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { UserProfileComponent } from '../user-profile/user-profile.component';

@Component({
  selector: 'app-user-purchases',
  templateUrl: './user-purchases.component.html',
  styleUrls: ['./user-purchases.component.css']
})
export class UserPurchasesComponent implements OnInit {
  first = 0;
  rows = 10;
  transactions: Transaction[] = [];
  expandedRows: {} = {};
  loading: boolean = true;
  user: User = null;
  progressBarVisible: boolean = false;

  constructor(private transactionService: TransactionService,
    private productService: ProductService,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.progressBarVisible = true;
    const thisRef = this;
    this.getTransactions(thisRef);
  }

  getTransactions(ref: any) {
    this.authService.getUser().pipe(concatMap(user => {
      this.user = user;
      return new Promise(resolve => setTimeout(() => resolve(user), 500));
    })).subscribe(value => {
      this.transactionService.getTransactionsByUser(+this.user.id).pipe(concatMap(
        data => {
          this.transactions = data;
          return new Promise(resolve => setTimeout(() => resolve(data), 500));
        }
      )).subscribe((value: any) => {
        this.transactionService.getTransactionItems().pipe(concatMap(
          transItem => {
            transItem.forEach(item => {
              this.transactions.forEach(transaction => {
                for (var i = 0; i < transaction.transactionItems.length; i++) {
                  if (transaction.transactionItems[i] === item.id) {
                    transaction.transactionItems[i] = item;
                  }
                }
              })
            })
            this.productService.getAllBasicProducts().subscribe(
              product => {
                this.transactions.forEach(trans => {
                  trans.transactionItems.forEach(transItem => {
                    product.content.forEach(prod => {
                      if (transItem.shopItem === prod.id) {
                        transItem.shopItem = prod;
                      }
                    })
                  })
                })
              }
            )
            return new Promise(resolve => setTimeout(() => resolve(transItem), 500));
          }
        )).subscribe((value: any) => {
          this.loading = false;
          this.transactions.forEach(function (trans) {
            ref.expandedRows[trans.id] = true;
          });
          this.expandedRows = Object.assign({}, this.expandedRows);
          this.progressBarVisible = false;
        })
      })
    });

  }

  scrollUp() {
    window.scroll(0, 0);
  }
  logout() {
    this.confirmationService.confirm({
      message: 'Biztos benne, hogy ki szeretne lépni?',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.authService.signOut();
        this.messageService.add({ severity: 'success', summary: 'Kijelentkezve', detail: `Várjuk vissza`, life: 1000 });
        setTimeout(() => {
          this.router.navigateByUrl("/home")
            .then(() => {
              window.location.reload();
            });
        }, 1000);
      },
      key: "logoutDialog"
    });
  }

}
