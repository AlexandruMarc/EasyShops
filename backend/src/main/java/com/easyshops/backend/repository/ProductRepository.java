package com.easyshops.backend.repository;

import com.easyshops.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
  List<Product> findByCategoryNameIgnoreCase(String category);

  List<Product> findByBrandIgnoreCase(String brand);

  List<Product> findByCategoryNameAndBrandIgnoreCase(String category, String brand);

  List<Product> findByBrandAndNameIgnoreCase(String brand, String name);

  List<Product> findByNameContainingIgnoreCase(String name);

  Long countByBrandAndNameIgnoreCase(String brand, String name);

  boolean existsByNameAndBrand(String name, String brand);

  @Query("SELECT DISTINCT p.brand FROM Product p")
  List<String> findDistinctBrands();
}
