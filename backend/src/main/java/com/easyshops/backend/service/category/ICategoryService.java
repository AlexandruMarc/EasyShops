package com.easyshops.backend.service.category;

import com.easyshops.backend.dto.CategoryDto;
import com.easyshops.backend.model.Category;

import java.util.List;

public interface ICategoryService {
  Category getCategoryByName(String name);

  Category getCategoryById(Long id);

  List<Category> getAllCategories();

  Category addCategory(Category category);

  Category updateCategory(Category category, Long id);

  void deleteCategoryById(Long id);

  List<CategoryDto> getAllConvertedCategories(List<Category> categories);

  CategoryDto convertCategoryToDto(Category category);
}
