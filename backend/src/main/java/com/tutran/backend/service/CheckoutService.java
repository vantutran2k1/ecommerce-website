package com.tutran.backend.service;

import com.tutran.backend.dto.Purchase;
import com.tutran.backend.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
}
