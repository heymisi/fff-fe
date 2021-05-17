import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Instructor } from 'src/app/common/instructor';
import { Product } from 'src/app/common/product';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductSave } from 'src/app/common/product-save';
import { Sport } from 'src/app/common/sport';
import { User } from 'src/app/common/user';
import { InstructorService } from 'src/app/services/instructor.service';
import { ProductService } from 'src/app/services/product.service';
import { SportService } from 'src/app/services/sport.service';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  user: User;
  first = 0;
  rows = 10;
  loading: boolean = true;
  users: User[] = [];

  constructor(
    private userService: UserService) { }

  ngOnInit(): void {
    this.listInstructors();
  }
  listInstructors() {
    this.userService.getUsers().subscribe(
      data => {
        this.users = data;
        this.loading = false;
      })
  }
  scrollUp() {
    window.scroll(0, 0);
  }

}
