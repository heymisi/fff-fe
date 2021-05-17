import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { TokenStorageService } from 'src/app/auth/token-storage.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  roles: string[];
  user = 'guest';
  title = 'fitforfun';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.getAuthority();
  }
}
