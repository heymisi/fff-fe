import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/common/user';

@Component({
  selector: 'app-admin-index',
  templateUrl: './admin-index.component.html',
  styleUrls: ['./admin-index.component.css']
})
export class AdminIndexComponent implements OnInit {

  user: User = null;
  constructor(private authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
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
          this.router.navigateByUrl("/admin")
            .then(() => {
              window.location.reload();
            });
        }, 1000);
      },
      key: "logoutDialog"
    });
  }

}
