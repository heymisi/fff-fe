import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  aboutUsFormGroup: FormGroup;

  errorMessagesEmail = {
    required: 'Kérjük töltse ki az email mezőt!',
    pattern: 'Helyes email formátumot adjon meg! Pl: pelda@gmail.com',
    notUnique: 'Úgy tűnik nincs ilyen email regisztrálva a rendeszerünkben!'
  };
  constructor(public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.aboutUsFormGroup = this.formBuilder.group({
      emailGroup: this.formBuilder.group({
        email: [null, {
          validators: [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
        }],
      })
    });
  }

  get email() { return this.aboutUsFormGroup.get('emailGroup.email'); }

  errors(ctrl: AbstractControl): string[] {

    return ctrl.errors ? Object.keys(ctrl.errors) : [];
  }
  onClick() {
    if (this.aboutUsFormGroup.invalid) {
      this.aboutUsFormGroup.markAllAsTouched();
      return;
    }
  }
}
