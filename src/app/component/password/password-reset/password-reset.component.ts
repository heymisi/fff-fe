import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PasswordResetModel } from 'src/app/common/password-reset-model';
import { PasswordResetRequestModel } from 'src/app/common/password-reset-request-model';
import { UserService } from 'src/app/services/user.service';
import { FormValidators } from 'src/app/validators/form-validators';
import { PasswordResetDialogComponent } from '../../dialogs/password-reset-dialog/password-reset-dialog.component';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  hide = true;
  passwordResetFormGroup: FormGroup;

  constructor(private route: ActivatedRoute,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router

  ) { }

  ngOnInit(): void {

    this.passwordResetFormGroup = this.formBuilder.group({
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    })
  }
  get password() { return this.passwordResetFormGroup.get('password'); }
  onClick() {
    if (this.passwordResetFormGroup.invalid) {
      this.passwordResetFormGroup.markAllAsTouched();
      return;
    }
    const token: string = this.route.snapshot.paramMap.get('token');
    this.route.queryParams.subscribe(params => {
      let token = params['token'];
      this.userService.resetPassword(new PasswordResetModel(token, this.password.value)).subscribe(data => {
        if (data.payload === "password reset") {


          this.messageService.add({ severity: 'success', summary: 'Új jelszavad beállításra került', detail: ``, life: 1500 });
          setTimeout(() => {
            this.router.navigateByUrl("/login")
              .then(() => {
                window.location.reload();
              });
          }, 1500);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Jelszavad beállításának ideje érvényességét vesztette', detail: ``, life: 4000 });
        }
      },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Hibás token', detail: ``, life: 4000 });
        })
    });
  }
}
