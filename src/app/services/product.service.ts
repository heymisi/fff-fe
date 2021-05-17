import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { filter, map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';
import { ProductResponse } from '../common/product-response';
import { CommentEntity } from '../common/comment-entity';
import { FilterEvent } from '../common/filter-event';
import { ProductSave } from '../common/product-save';
import { CommentRequestModel } from '../common/comment-request-model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  private baseUrl = 'http://18.193.77.12:8080/fit-for-fun/shop-items';
  private categorytUrl = 'http://18.193.77.12:8080/fit-for-fun/item-categories';

  constructor(private httpClient: HttpClient) { }

  getAllBasicProducts(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl);
  }
  getProduct(productId: number): Observable<ProductResponse> {
    const productUrl = `${this.baseUrl}/${productId}`;
    return this.httpClient.get<ProductResponse>(productUrl);
  }
  getProductListPaginate(thePage: number,
    thePageSize: number,
    sortValue: string,
    filters: FilterEvent): Observable<any> {

    let searchUrl: any;
    searchUrl = `${this.baseUrl}` + `?page=${thePage}&limit=${thePageSize}`;

    if (sortValue != null) {
      searchUrl = searchUrl + `&filter=${sortValue}`;
    }

    if (filters != null) {
      let category: any;
      let sport: any;
      let priceMin: any;
      let priceMax: any;
      filters.categoryFilter ? category = filters.categoryFilter.categoryName : category = ""
      filters.sportFilter ? sport = filters.sportFilter.name : sport = ""
      if (filters.priceMax === 0 && filters.priceMin === 0) {
        priceMax = "";
        priceMin = "";
      } else {
        filters.priceMax ? priceMax = filters.priceMax : priceMax = ""
        filters.priceMin ? priceMin = filters.priceMin : priceMin = ""
      }
      searchUrl = searchUrl + `&sport=${sport}&category=${category}&priceMin=${priceMin}&priceMax=${priceMax}`
    }
    return this.httpClient.get<any>(searchUrl);
  }
  getProductList(theCategoryId: number): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/category/${theCategoryId}`;
    return this.getProducts(searchUrl);
  }
  getProductListWithoutFilters() {
    return this.httpClient.get<any>(`${this.baseUrl}/without-filters`)
      .toPromise()
      .then(res => <Product[]>res)
      .then(data => { return data; });
  }
  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<ProductCategory[]>(this.categorytUrl);;
  }
  getProductCategoryById(id: number): Observable<ProductCategory> {
    return this.httpClient.get<ProductCategory>(`${this.categorytUrl}/${id}`);
  }
  searchProducts(keyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/${keyword}`;
    return this.getProducts(searchUrl);
  }
  searchProductsPaginate(thePage: number,
    thePageSize: number,
    theKeyword: string): Observable<any> {

    const searchUrl = `${this.baseUrl}/search/${theKeyword}`
      + `?page=${thePage}&limit=${thePageSize}`;
    return this.httpClient.get<any>(searchUrl);
  }
  getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(map(response => response._embedded.products));
  }
  getComments(id: number): Observable<CommentEntity[]> {
    return this.httpClient.get<CommentEntity[]>(`${this.baseUrl}/${id}/comments`);
  }
  addComment(id: number, message: CommentRequestModel): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/${id}/addComment`, message);
  }
  deleteProduct(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${id}`);
  }
  saveProduct(product: Product): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl, product);
  }
  modifyProduct(id: number, product: Product): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}/${id}`, product);
  }
  addImage(id: number, file: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/${id}/uploadImage`, file);
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    titalElements: number,
    totalPages: number,
    number: number;
  }
}