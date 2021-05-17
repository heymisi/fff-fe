import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-succes-registration',
  templateUrl: './succes-registration.component.html',
  styleUrls: ['./succes-registration.component.css']
})
export class SuccesRegistrationComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}
