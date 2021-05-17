import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-registration-confirm',
  templateUrl: './registration-confirm.component.html',
  styleUrls: ['./registration-confirm.component.css']
})
export class RegistrationConfirmComponent implements OnInit {

  isValid = false;

  constructor(private route: ActivatedRoute,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    const token: string = this.route.snapshot.paramMap.get('token');
    this.route.queryParams.subscribe(params => {
      let token = params['token'];
      this.userService.verifyEmailToken(token).subscribe(data => {
        if (data.payload === "Successful email verification") {
          this.isValid = true;
        } else {
          this.isValid = false;
        }
      })
    });
  }

}
