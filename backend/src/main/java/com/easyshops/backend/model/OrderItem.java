package com.easyshops.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class OrderItem {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private int quantity;
  private BigDecimal price;

  @ManyToOne
  @JoinColumn(name = "order_id")
  private Order order;

  @ManyToOne
  @JoinColumn(name = "product_id", nullable = true)
  private Product product;

  // Snapshot
  private String name;
  private String brand;
  private BigDecimal productPrice;
  private String productDescription;
  private String productCategoryName;

  public OrderItem(Product product, int quantity, BigDecimal price, Order order) {
    this.product = product;
    this.quantity = quantity;
    this.price = price;
    this.order = order;
  }
}
