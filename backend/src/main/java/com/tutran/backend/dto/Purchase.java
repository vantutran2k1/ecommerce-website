package com.tutran.backend.dto;

import com.tutran.backend.entity.Address;
import com.tutran.backend.entity.Customer;
import com.tutran.backend.entity.Order;
import com.tutran.backend.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
