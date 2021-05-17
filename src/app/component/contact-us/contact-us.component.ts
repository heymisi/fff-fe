import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ContactUsService } from 'src/app/services/contact-us.service';
import { UserService } from 'src/app/services/user.service';
import { ContactUsDialogComponent } from '../dialogs/contact-us-dialog/contact-us-dialog.component';


@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  aboutUsFormGroup: FormGroup;
  submitted: Boolean = false;

  constructor(public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private contactUsService: ContactUsService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.aboutUsFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      message: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]]
    });
  }

  get email() { return this.aboutUsFormGroup.get('email'); }
  get message() { return this.aboutUsFormGroup.get('message'); }

  onSubmit() {
    this.submitted = true;
    if (this.aboutUsFormGroup.invalid) {
      return false;
    } else {
      this.contactUsService.sendEmail(this.email.value, this.message.value).subscribe();
      this.messageService.add({ severity: 'success', summary: 'Köszönjük visszajelzését', detail: ``, life: 1000 });
      setTimeout(() => {
        this.router.navigateByUrl("/home")
          .then(() => {
            window.location.reload();
          });
      }, 1000);
    }
  }
}
