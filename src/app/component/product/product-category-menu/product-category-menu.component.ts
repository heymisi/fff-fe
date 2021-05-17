import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FilterEvent } from 'src/app/common/filter-event';
import { ProductCategory } from 'src/app/common/product-category';
import { Sport } from 'src/app/common/sport';
import { ProductService } from 'src/app/services/product.service';
import { SportService } from 'src/app/services/sport.service';
import { ProductListComponent } from '../product-list/product-list.component';
interface Prices {
  text: string,
  min: number,
  max: number,
}
@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {

  @Output() filteredClick = new EventEmitter<any>();

  productCategories: ProductCategory[];
  sports: Sport[] = [];
  categoryFilter: ProductCategory = null;
  sportFilter: Sport = null;
  priceFilter: Prices = null;
  priceCategories: Prices[] = [
    { text: "0-5000 Ft.", min: 1, max: 5000 },
    { text: "5-10000 Ft.", min: 5000, max: 10000 },
    { text: "10-20000 Ft..", min: 10000, max: 20000 },
    { text: "20-50000 Ft.", min: 20000, max: 50000 },
    { text: "50-100000 Ft.", min: 50000, max: 100000 },
    { text: "100000 Ft. fölött", min: 100000, max: 9999999999 },
  ]

  constructor(private productService: ProductService, private sportService: SportService) { }

  ngOnInit(): void {
    this.listSportCategories();
    this.listProductCategories();
    this.priceCategories[0];
  }
  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        this.productCategories = data;
      }
    );
  }
  listSportCategories() {
    this.sportService.getSport().subscribe(
      data => {
        this.sports = data;
      }
    )
  }
  onFilter() {
    if (this.priceFilter === null) {
      this.filteredClick.emit(new FilterEvent(this.categoryFilter, this.sportFilter, 0, 0));

    } else {
      this.filteredClick.emit(new FilterEvent(this.categoryFilter, this.sportFilter, this.priceFilter?.min, this.priceFilter?.max));

    }
  }
  onDiscard() {
    this.priceFilter = null;
    this.sportFilter = null;
    this.categoryFilter = null;
  }
}