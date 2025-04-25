package com.easyshops.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class CategoryDto {
  private Long id;
  private String name;
  private List<ProductDtoForCategory> products;
}
