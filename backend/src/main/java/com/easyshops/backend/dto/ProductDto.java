package com.easyshops.backend.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductDto {
  private Long id;
  private String name;
  private String brand;
  private BigDecimal price;
  private int inventory;
  private String description;
  private CategoryDtoForProduct category;
  private List<ImageDto> images;
}
