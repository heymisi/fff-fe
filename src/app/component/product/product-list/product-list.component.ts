import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { CartItem } from 'src/app/common/cart-item';
import { FilterEvent } from 'src/app/common/filter-event';
import { Product } from 'src/app/common/product';
import { Sport } from 'src/app/common/sport';
import { TransactionItem } from 'src/app/common/transaction-item';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  progressBarVisible: boolean = false;

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  //pagination
  pageNumber: number = 1;
  pageSize: number = 9;
  totalElements: number = 0;

  previousKeyword: string = null;

  filters: FilterEvent = null;

  selectedPageSize: any;
  selectedSort: string = null;
  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private messageService: MessageService,
    private authService: AuthService
  ) { }
  ngOnInit() {
    this.progressBarVisible = true;
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has("keyword");
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }
  handleListProducts() {
    this.productService.getProductListPaginate(this.pageNumber - 1,
      this.pageSize,
      this.selectedSort,
      this.filters)
      .subscribe(this.proccessResult());
    window.scroll(0, 0);
  }
  proccessResult() {
    return data => {
      this.products = data.content;
      this.pageNumber = data.number + 1;
      this.pageSize = data.size;
      this.totalElements = data.totalElements;
      this.progressBarVisible = false;
    }
  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get("keyword");
    if (theKeyword === "") {
      this.handleListProducts();
      return;
    }
    if (this.previousKeyword != theKeyword) {
      this.pageNumber = 1;
    }
    this.previousKeyword = theKeyword;
    this.productService.searchProductsPaginate(this.pageNumber - 1,
      this.pageSize,
      theKeyword).subscribe(this.proccessResult());
  }

  updatePageSize(pageSize: string) {
    this.pageSize = +pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  sortPage() {
    this.pageNumber = 1;
    this.listProducts();
  }

  addToCart(product: Product) {
    if (this.authService.isLoggedIn()) {
      const cartItem = new TransactionItem();
      cartItem.shopItem = product;
      cartItem.quantity = 1;
      this.cartService.addToCart(cartItem);
      this.messageService.add({ severity: 'success', summary: 'Kosárba helyezve', detail: `${product.name} sikeresen hozzáadva a kosarához!`, life: 4000 });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Jelentkezz be', detail: `Termék kosárba helyezése csak bejelentkezés után érhető el`, life: 4000 });
    }
  }

  onFiltered(filter: FilterEvent) {
    this.filters = filter;
    this.listProducts();
  }
}
