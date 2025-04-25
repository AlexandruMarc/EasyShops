package com.easyshops.backend.repository;

import com.easyshops.backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
  Category findByNameIgnoreCase(String name);

  boolean existsByName(String name);
}
