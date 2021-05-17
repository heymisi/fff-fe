import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  user = 'admin';
  title = 'fitforfun';
  navLinks = [
    { path: 'home', label: 'Home' },
    { path: 'food', label: 'Food' }
  ];

  constructor(
    private router: Router,
  ) {
    this.navLinks = this.buildNavItems(this.router.config);
  }

  buildNavItems(routes: Routes) {
    return (routes)
      .filter(route => route.data)
      .map(({ path = '', data }) => ({
        path: path,
        label: data.label,
        icon: data.icon
      }));
  }
  ngOnInit(){}
}
