package com.easyshops.backend.exeptions;

public class InvalidCuponExeption extends RuntimeException {
  public InvalidCuponExeption(String message) {
    super(message);
  }
}
