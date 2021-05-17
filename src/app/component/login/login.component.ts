import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TokenStorageService } from 'src/app/auth/token-storage.service';
import { LoginRequest } from 'src/app/common/login-request';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  checkoutFormGroup: FormGroup;

  errorMessagesEmail = {
    required: 'Kérjük töltse ki az email mezőt!',
    pattern: 'A megadott email nem helyes formátumú!',
  };

  constructor(private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private userService: UserService,
    private tokenStorage: TokenStorageService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      login: this.formBuilder.group({
        email: new FormControl('',
          [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
        password: new FormControl('',
          [Validators.required]),
      })
    })
  }

  get email() { return this.checkoutFormGroup.get('login.email'); }
  get password() { return this.checkoutFormGroup.get('login.password'); }


  errors(ctrl: AbstractControl): string[] {

    return ctrl.errors ? Object.keys(ctrl.errors) : [];
  }
  onLogin() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    this.userService.login(new LoginRequest(this.email.value, this.password.value)).subscribe(
      data => {
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUserId(data.userId);
        this.tokenStorage.saveAuthorities(data.role);
        this.messageService.add({ severity: 'success', summary: 'Üdvözlünk', detail: ``, life: 1000 });
        setTimeout(() => {
          this.router.navigateByUrl("/home")
            .then(() => {
              window.location.reload();
            });
        }, 1000);
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Sikertelen bejelentkezés', detail: `Ez a felhasználónév vagy jelszó nem megfelelő`, life: 5000 });
      }

    )
  }
}
