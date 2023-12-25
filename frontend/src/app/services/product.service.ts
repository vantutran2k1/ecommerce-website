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

  getProductsByCategoryPagination(pageNumber: number, pageSize: number, categoryId: number): Observable<GetResponseProducts> {
    const searchUrl: string = `${this.productUrl}/search/findByCategoryId?id=${categoryId}&page=${pageNumber}&size=${pageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductsByName(name: string): Observable<Product[]> {
    return this.getProducts(`${this.productUrl}/search/findByNameContaining?name=${name}`);
  }

  getProductsByNamePagination(pageNumber: number, pageSize: number, name: string): Observable<GetResponseProducts> {
    const searchUrl: string = `${this.productUrl}/search/findByNameContaining?name=${name}&page=${pageNumber}&size=${pageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductById(productId: number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.productUrl}/${productId}`);
  }

  getAllProducts(): Observable<Product[]> {
    return this.getProducts(this.productUrl);
  }

  getAllProductsPagination(pageNumber: number, pageSize: number): Observable<GetResponseProducts> {
    const searchUrl: string = `${this.productUrl}?page=${pageNumber}&size=${pageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getCategoryById(categoryId: number): Observable<ProductCategory> {
    return this.httpClient.get<ProductCategory>(`${this.categoryUrl}/${categoryId}`);
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
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseCategories {
  _embedded: {
    productCategories: ProductCategory[];
  }
}
