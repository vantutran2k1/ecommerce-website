import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Product} from "../common/product";
import {ProductCategory} from "../common/product-category";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) {
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.getProducts(`${this.productUrl}/search/findByCategoryId?id=${categoryId}`);
  }

  getProductsByName(name: string): Observable<Product[]> {
    return this.getProducts(`${this.productUrl}/search/findByNameContaining?name=${name}`);
  }

  getAllProducts(): Observable<Product[]> {
    return this.getProducts(this.productUrl);
  }

  getCategoryById(categoryId: number): Observable<ProductCategory> {
    const searchUrl = `${this.categoryUrl}/search/findById?id=${categoryId}`;
    return this.httpClient.get<GetResponseCategories>(searchUrl).pipe(
      map(response => response._embedded.productCategories[0])
    );
  }

  getAllCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseCategories>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategories)
    );
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  }
}

interface GetResponseCategories {
  _embedded: {
    productCategories: ProductCategory[];
  }
}
