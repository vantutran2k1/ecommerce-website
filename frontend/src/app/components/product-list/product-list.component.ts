import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  categoryFilterMode: boolean = false;
  currentCategoryId: number = -1;
  previousCategoryId: number = -1;
  currentCategoryName: string = "";

  searchMode: boolean = false;
  searchKeyword: string = "";
  previousKeyword: string = "";

  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;

  constructor(private productService: ProductService, private cartService: CartService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => this.listProducts());
  }

  listProducts() {
    if (this.hasCategoryId())
      this.handleCategoryFilterProducts();
    else if (this.hasSearchKeyword())
      this.handleSearchProducts();
    else
      this.handleAllProducts();
  }

  updatePageSize(pageSize: string) {
    this.pageSize = +pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  addToCart(product: Product) {
    this.cartService.addToCart(new CartItem(product));
  }

  private handleAllProducts() {
    this.productService.getAllProductsPagination(
      this.pageNumber - 1,
      this.pageSize
    ).subscribe(this.processResponseProducts());
  }

  private handleSearchProducts() {
    this.searchMode = true;
    this.searchKeyword = this.route.snapshot.paramMap.get('keyword')!;

    if (this.previousKeyword != this.searchKeyword)
      this.pageNumber = 1;
    this.previousKeyword = this.searchKeyword;

    this.productService.getProductsByNamePagination(
      this.pageNumber - 1,
      this.pageSize,
      this.searchKeyword
    ).subscribe(this.processResponseProducts());
  }

  private handleCategoryFilterProducts() {
    this.categoryFilterMode = true;
    this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getCategoryById(this.currentCategoryId).subscribe(category => this.currentCategoryName = category.categoryName);

    if (this.previousCategoryId != this.currentCategoryId)
      this.pageNumber = 1;
    this.previousCategoryId = this.currentCategoryId;

    this.productService.getProductsByCategoryPagination(
      this.pageNumber - 1,
      this.pageSize,
      this.currentCategoryId
    ).subscribe(this.processResponseProducts());
  }

  private processResponseProducts() {
    return (response: any) => {
      this.products = response._embedded.products;
      this.pageNumber = response.page.number + 1;
      this.pageSize = response.page.size;
      this.totalElements = response.page.totalElements;
    };
  }

  private hasCategoryId(): boolean {
    return this.route.snapshot.paramMap.has('id');
  }

  private hasSearchKeyword(): boolean {
    return this.route.snapshot.paramMap.has('keyword');
  }
}
