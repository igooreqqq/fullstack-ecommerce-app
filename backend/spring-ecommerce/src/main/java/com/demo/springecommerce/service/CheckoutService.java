package com.demo.springecommerce.service;

import com.demo.springecommerce.dto.Purchase;
import com.demo.springecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
