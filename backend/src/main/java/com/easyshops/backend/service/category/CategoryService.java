package com.easyshops.backend.service.category;

import com.easyshops.backend.dto.CategoryDto;
import com.easyshops.backend.dto.ProductDtoForCategory;
import com.easyshops.backend.exeptions.AlreadyExistsException;
import com.easyshops.backend.exeptions.CategoryDeletionException;
import com.easyshops.backend.exeptions.ResourceNotFoundException;
import com.easyshops.backend.model.Category;
import com.easyshops.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class CategoryService implements ICategoryService {
  private final CategoryRepository categoryRepository;
  private final ModelMapper modelMapper;

  @Override
  public Category getCategoryByName(String name) {
    return categoryRepository.findByNameIgnoreCase(name);
  }

  @Override
  public Category getCategoryById(Long id) {
    return categoryRepository.findById(id).orElseThrow(
            () -> new ResourceNotFoundException("Category not found!"));
  }

  @Override
  public List<Category> getAllCategories() {
    return categoryRepository.findAll();
  }

  @Override
  public Category addCategory(Category category) {
    return Optional.of(category)
                   .filter(c -> !categoryRepository.existsByName(c.getName()))
                   .map(categoryRepository::save).orElseThrow(
                    () -> new AlreadyExistsException(
                            category.getName() + " already exists!"));
  }

  @Override
  public Category updateCategory(Category category, Long id) {
    return Optional.ofNullable(getCategoryById(id)).map(oldCategory -> {
      oldCategory.setName(category.getName());
      return categoryRepository.save(oldCategory);
    }).orElseThrow(() -> new ResourceNotFoundException("Category not found!"));
  }

  @Override
  public void deleteCategoryById(Long id) {
    Category category = getCategoryById(id);
    if (category.getProducts() != null && !category.getProducts().isEmpty()) {
      throw new CategoryDeletionException(
              "Can't delete this category because it is assigned to some products. Change the products category and try again!");
    }
    categoryRepository.delete(category);
  }

  @Override
  public List<CategoryDto> getAllConvertedCategories(List<Category> categories) {
    return categories.stream().map(this::convertCategoryToDto)
                     .collect(toList());
  }

  @Override
  public CategoryDto convertCategoryToDto(Category category) {
    CategoryDto categoryDto = modelMapper.map(category, CategoryDto.class);
    if (category.getProducts() != null) {
      List<ProductDtoForCategory> productDtos = category.getProducts().stream()
                                                        .map(product -> modelMapper.map(
                                                                product,
                                                                ProductDtoForCategory.class))
                                                        .collect(toList());
      categoryDto.setProducts(productDtos);
    }
    return categoryDto;
  }

}
