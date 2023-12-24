import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 1;
  currentCategoryName: string = "";

  constructor(private productService: ProductService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => this.listProducts());
  }

  listProducts() {
    if (this.hasCategoryId()) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }

    this.setCategoryName();

    this.productService.getProductList(this.currentCategoryId).subscribe(data => this.products = data)
  }

  private hasCategoryId(): boolean {
    return this.route.snapshot.paramMap.has('id');
  }

  private setCategoryName() {
    this.productService.getProductCategory(this.currentCategoryId).subscribe(data => this.currentCategoryName = data.categoryName);
  }
}
