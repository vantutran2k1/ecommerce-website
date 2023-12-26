import {Injectable} from '@angular/core';
import {CartItem} from "../common/cart-item";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() {
  }

  addToCart(cartItem: CartItem) {
    let existingCartItem: CartItem | undefined = this.cartItems.find(currentItem => currentItem.id === cartItem.id);
    if (existingCartItem != undefined)
      existingCartItem.quantity++;
    else
      this.cartItems.push(cartItem);

    this.computeCartTotals();
  }

  private computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    for (let cartItem of this.cartItems) {
      totalPriceValue += cartItem.unitPrice * cartItem.quantity;
      totalQuantityValue += cartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }
}
