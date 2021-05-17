import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { concatMap } from 'rxjs/operators';
import { Product } from 'src/app/common/product';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductSave } from 'src/app/common/product-save';
import { Sport } from 'src/app/common/sport';
import { ProductService } from 'src/app/services/product.service';
import { SportService } from 'src/app/services/sport.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  productDialog: boolean;
  product: Product;
  selectedProducts: Product[];
  submitted: boolean;
  first = 0;
  rows = 10;
  loading: boolean = true;
  products: Product[] = [];
  uploadedFiles: any[] = [];
  customUpload = true;
  productCategories: ProductCategory[] = [];
  sports: Sport[] = [];


  selectedFile: File;
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;

  constructor(private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private sportService: SportService) { }

  ngOnInit(): void {
    this.listProducts();
    this.listProductCategories();
    this.listSportCategories();
  }
  listProducts() {
    this.productService.getProductListWithoutFilters().then(
      products => {
        this.products = products;
        this.loading = false;
      })
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
  openNew() {
    this.product = {};
    this.submitted = false;
    this.selectedFile = null;
    this.productDialog = true;
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: 'Biztos benne, hogy tölörni szeretné az alábbi terméket: ' + product.name + '?',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService.deleteProduct(+product.id).subscribe(value => {
          if (value.payload === "PRODUCT_ALREADY_IN_USE") {
            this.messageService.add({ key: 'admin-product-key', severity: 'error', summary: 'Sikertelen törlés', detail: 'Ez a termék már legalább egyszer megvásárlásra került, ezért az adatbázisból nem törölhető!', life: 3000 });
          } else {
            this.products = this.products.filter(val => val.id !== product.id);
            this.product = {};
            this.messageService.add({ key: 'admin-product-key', severity: 'success', summary: '', detail: 'Termék törlésre került', life: 3000 });
          }
        });

      }
    });
  }
  
  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  editProduct(product: Product) {
    this.product = { ...product };
    this.productDialog = true;
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  saveProduct() {
    this.submitted = true;
    if (this.product.name.trim()) {
      if (this.product.id) {
        this.productCategories.forEach(category => {
          if (category.categoryName == this.product.category.categoryName) {
            this.product.category = category;
          }
        })
        this.sports.forEach(sport => {
          if (sport.name == this.product.sportType.name) {
            this.product.sportType = sport;
          }
        })
        this.product.transactionItems = [];
        this.product.comments = [];

        this.productService.modifyProduct(+this.product.id, this.product).subscribe(
          data => {
            if (this.selectedFile !== null) {
              this.addImage(data.payload.id)
            }
            this.products[this.findIndexById(this.product.id)] = this.product;
            this.messageService.add({ key: 'admin-product-key', severity: 'success', summary: 'Sikeres', detail: 'A termék módosítás megtörtént', life: 3000 });
            this.productDialog = false;
            this.products = [...this.products];
            this.product = {};
          },
          error => {
            this.messageService.add({ key: 'admin-product-key', severity: 'error', summary: 'Hiba', detail: 'Hiba történt a termék módosítása közben', life: 3000 });
            return;
          }
        );
      }
      else {
        this.productService.saveProduct(this.product).subscribe(
          data => {
            this.products.push(data.payload);
            this.addImage(data.payload.id)
            this.messageService.add({ key: 'admin-product-key', severity: 'success', summary: 'Sikeres', detail: 'Az új termék létrehozása megtörtént', life: 3000 });
            this.productDialog = false;
            this.products = [...this.products];
            this.product = {};
          },
          error => {
            this.messageService.add({ key: 'admin-product-key', severity: 'error', summary: 'Hiba', detail: 'Hiba történt a termék létrehozása közben', life: 3000 });
            return;
          }
        )
      }
    }
  }

  public onFileChanged(event) {
    this.selectedFile = event.files[0];
  }

  addImage(id: number) {
    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', this.selectedFile, this.selectedFile.name);
    this.productService.addImage(id, uploadImageData).pipe(concatMap(
      value => {
        return new Promise(resolve => setTimeout(() => resolve(value), 500));
      }
    )).subscribe(value => {
      this.listProducts();
    })
  }


  scrollUp() {
    window.scroll(0, 0);
  }
}
