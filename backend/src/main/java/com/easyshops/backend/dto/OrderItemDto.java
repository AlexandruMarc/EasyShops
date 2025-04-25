package com.easyshops.backend.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemDto {
  private Long productId;
  private String productName;
  private String productBrand;
  private int quantity;
  private BigDecimal price;
  private String name;
  private String brand;
  private String description;
}
