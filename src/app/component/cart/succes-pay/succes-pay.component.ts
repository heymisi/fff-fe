import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-succes-pay',
  templateUrl: './succes-pay.component.html',
  styleUrls: ['./succes-pay.component.css']
})
export class SuccesPayComponent implements OnInit {
  constructor() { }
  date: Date;

  ngOnInit(): void {
    this.date = new Date();
    this.date.setDate(this.date.getDate() + 14);
  }

}
