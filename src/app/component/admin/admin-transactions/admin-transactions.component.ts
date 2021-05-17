import { Component, OnInit } from '@angular/core';
import { concatMap } from 'rxjs/operators';
import { Transaction } from 'src/app/common/transaction';
import { TransactionItem } from 'src/app/common/transaction-item';
import { User } from 'src/app/common/user';
import { TransactionService } from 'src/app/services/transaction.service';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-admin-transactions',
  templateUrl: './admin-transactions.component.html',
  styleUrls: ['./admin-transactions.component.css']
})
export class AdminTransactionsComponent implements OnInit {
  first = 0;
  rows = 10;
  loading: boolean = true;
  transactions: Transaction[] = [];
  users: User[] = [];
  selectedTransaction: Transaction;

  constructor(private transactionService: TransactionService,
    private userService: UserService,
    private utilService: UtilService) { }

  ngOnInit(): void {
    this.listTransactions();

  }
  listTransactions() {
    this.userService.getUsers().pipe(concatMap(
      data => {
        this.users = data;
        return new Promise(resolve => setTimeout(() => resolve(data), 500));
      })).subscribe((value: any) => {
        this.transactionService.getTransactions().pipe(concatMap(
          data => {
            this.transactions = data;
            this.users.forEach(user => {
              this.transactions.forEach(trans => {
                if (trans.purchaser === user.id) {
                  trans.purchaser = user;
                }
              })
            })
            this.transactionService.getTransactionItems().subscribe(
              data => {
                data.forEach(transactionItem => {
                  this.transactions.forEach(transaction => {
                    for (var i = 0; i < transaction.transactionItems.length; i++) {
                      if (transaction.transactionItems[i] === transactionItem.id) {
                        transaction.transactionItems[i] = transactionItem;
                      }
                    }
                  })
                })
              }
            )
            return new Promise(resolve => setTimeout(() => resolve(data), 500));
          }
        )).subscribe((value: any) => {
          this.utilService.getShopItems().subscribe(shopItem => {
            shopItem.forEach(item => {
              this.transactions.forEach(transaction => {
                for (let i = 0; i < transaction.transactionItems.length; i++) {
                  if (transaction.transactionItems[i].shopItem === item.id) {
                    transaction.transactionItems[i].shopItem = item;
                    break;
                  }
                }
              })
            })
            this.loading = false;
          })
        })
      })
  }

  scrollUp() {
    window.scroll(0, 0);
  }
}
