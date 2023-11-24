package com.demo.springecommerce.dto;


import com.demo.springecommerce.entity.Address;
import com.demo.springecommerce.entity.Customer;
import com.demo.springecommerce.entity.Order;
import com.demo.springecommerce.entity.OrderItem;
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
