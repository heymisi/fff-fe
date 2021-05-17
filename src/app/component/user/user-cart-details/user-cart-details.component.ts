import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/common/user';

@Component({
  selector: 'app-user-cart-details',
  templateUrl: './user-cart-details.component.html',
  styleUrls: ['./user-cart-details.component.css']
})
export class UserCartDetailsComponent implements OnInit {
  user: User = null;

  constructor(private messageService: MessageService,
    private router: Router,
    private authService: AuthService,
    private confirmationService: ConfirmationService,) { }

  ngOnInit(): void {
    this.getUser();
  }
  getUser() {
    this.authService.getUser().subscribe(user => {
      this.user = user;
    });
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
