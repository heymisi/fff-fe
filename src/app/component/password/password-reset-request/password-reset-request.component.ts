import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { PasswordResetRequestModel } from 'src/app/common/password-reset-request-model';
import { UserService } from 'src/app/services/user.service';
import { FormValidators } from 'src/app/validators/form-validators';

@Component({
  selector: 'app-password-reset-request',
  templateUrl: './password-reset-request.component.html',
  styleUrls: ['./password-reset-request.component.css']
})
export class PasswordResetRequestComponent implements OnInit {


  checkoutFormGroup: FormGroup;


  errorMessagesEmail = {
    required: 'Kérjük töltse ki az email mezőt!',
    pattern: 'Helyes email formátumot adjon meg! Pl: pelda@gmail.com',
    notUnique: 'Úgy tűnik nincs ilyen email regisztrálva a rendeszerünkben!'
  };
  constructor(public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,

  ) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      emailGroup: this.formBuilder.group({
        email: [null, {
          validators: [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
          asyncValidators: FormValidators.emailIsValid(this.userService), updateOn: 'blur'
        }],
      })
    });
  }

  get email() { return this.checkoutFormGroup.get('emailGroup.email'); }

  errors(ctrl: AbstractControl): string[] {

    return ctrl.errors ? Object.keys(ctrl.errors) : [];
  }
  onClick() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    this.userService.requestPasswordReset(new PasswordResetRequestModel(this.email.value)).subscribe(data => {
      if (data.payload = "Successful password reset request") {
        this.messageService.add({ severity: 'success', summary: 'Új jelszó igényelve', detail: 'Jelszavad az emailedre küldött linken keresztül megváltoztathatod. Kérjük vegye figyelembe, hogy innentől kezdve egy óráig van lehetősége erre!', life: 5000 });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Hiba történt', life: 3000 });
      }
    })
  }
}
