package com.easyshops.backend.exeptions;

public class ProductNotFoundExeption extends RuntimeException {
  public ProductNotFoundExeption(String message) {
    super(message);
  }
}
