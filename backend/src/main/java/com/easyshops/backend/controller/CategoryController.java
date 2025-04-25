package com.easyshops.backend.controller;

import com.easyshops.backend.dto.CategoryDto;
import com.easyshops.backend.exeptions.CategoryDeletionException;
import com.easyshops.backend.exeptions.ResourceNotFoundException;
import com.easyshops.backend.model.Category;
import com.easyshops.backend.response.ApiResponse;
import com.easyshops.backend.service.category.ICategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/categories")
public class CategoryController {
  private final ICategoryService categoryService;

  @GetMapping("/all")
  public ResponseEntity<ApiResponse> getAllCategories() {
    try {
      List<Category> categories = categoryService.getAllCategories();
      List<CategoryDto> categoriesDto =
              categoryService.getAllConvertedCategories(categories);
      return ResponseEntity.ok(new ApiResponse("Found!", categoriesDto));
    } catch (Exception e) {
      return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                           .body(new ApiResponse("Error: ",
                                   INTERNAL_SERVER_ERROR));
    }
  }

  @PostMapping("/add")
  public ResponseEntity<ApiResponse> addCategory(@RequestBody Category name) {
    try {
      Category theCategory = categoryService.addCategory(name);
      CategoryDto categoryDto =
              categoryService.convertCategoryToDto(theCategory);
      return ResponseEntity.ok(
              new ApiResponse("Added successfully the category:", categoryDto));
    } catch (Exception e) {
      return ResponseEntity.status(CONFLICT)
                           .body(new ApiResponse(e.getMessage(), null));
    }
  }

  @GetMapping("/category/{id}/ids")
  public ResponseEntity<ApiResponse> getCategoryById(@PathVariable Long id) {
    try {
      Category theCategory = categoryService.getCategoryById(id);
      CategoryDto categoryDto =
              categoryService.convertCategoryToDto(theCategory);
      return ResponseEntity.ok(new ApiResponse("Found", categoryDto));
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(NOT_FOUND)
                           .body(new ApiResponse(e.getMessage(), null));
    }
  }

  @GetMapping("/category/{name}/name")
  public ResponseEntity<ApiResponse> getCategoryByName(
          @PathVariable String name) {
    try {
      Category theCategory = categoryService.getCategoryByName(name);
      CategoryDto categoryDto =
              categoryService.convertCategoryToDto(theCategory);
      return ResponseEntity.ok(new ApiResponse("Found", categoryDto));
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(NOT_FOUND)
                           .body(new ApiResponse(e.getMessage(), null));
    }
  }

  @DeleteMapping("/category/{id}/delete")
  public ResponseEntity<ApiResponse> deleteCategory(@PathVariable Long id) {
    try {
      categoryService.deleteCategoryById(id);
      return ResponseEntity.ok(
              new ApiResponse("Successfully deleted category", id));
    } catch (CategoryDeletionException e) {
      return ResponseEntity.status(CONFLICT)
                           .body(new ApiResponse(e.getMessage(), null));
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(NOT_FOUND)
                           .body(new ApiResponse(e.getMessage(), null));
    }
  }

  @PutMapping("/category/{id}/update")
  public ResponseEntity<ApiResponse> updateCategory(
          @PathVariable Long id, @RequestBody Category category) {
    try {
      Category updatedCategory = categoryService.updateCategory(category, id);
      CategoryDto categoryDto =
              categoryService.convertCategoryToDto(updatedCategory);
      return ResponseEntity.ok(new ApiResponse("Update success!", categoryDto));
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(NOT_FOUND)
                           .body(new ApiResponse(e.getMessage(), null));
    }
  }


}
