package com.easyshops.backend.exeptions;

public class CategoryDeletionException extends RuntimeException {
  public CategoryDeletionException(String message) {
    super(message);
  }
}
