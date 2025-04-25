package com.easyshops.backend.controller;

import com.easyshops.backend.dto.ProductDto;
import com.easyshops.backend.exeptions.AlreadyExistsException;
import com.easyshops.backend.exeptions.CantDeleteException;
import com.easyshops.backend.exeptions.ResourceNotFoundException;
import com.easyshops.backend.model.Product;
import com.easyshops.backend.request.AddProductRequest;
import com.easyshops.backend.request.ProductUpdateRequest;
import com.easyshops.backend.response.ApiResponse;
import com.easyshops.backend.service.product.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/products")
public class ProductController {
  private final IProductService productService;

  @GetMapping("/all")
  public ResponseEntity<ApiResponse> getAllProducts() {
    List<Product> products = productService.getAllProducts();
    List<ProductDto> convertedProducts =
            productService.getConvertedProducts(products);
    return ResponseEntity.ok(
            new ApiResponse("Retrieve products success!", convertedProducts));
  }

  @GetMapping("/product/{productId}/product")
  public ResponseEntity<ApiResponse> getProductById(
          @PathVariable Long productId) {
    try {
      Product product = productService.getProductById(productId);
      ProductDto convertedProduct = productService.convertToDto(product);
      return ResponseEntity.ok(new ApiResponse("Retrieve product ID success!",
              convertedProduct));
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(NOT_FOUND)
                           .body(new ApiResponse(e.getMessage(), null));
    }
  }

  // Note: The role has to have ROLE_ something because else something in PreAuthorize doest see it as a role
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @PostMapping("/add")
  public ResponseEntity<ApiResponse> addProduct(
          @RequestBody AddProductRequest product) {
    try {
      Product theProduct = productService.addProduct(product);
      ProductDto productDto = productService.convertToDto(theProduct);
      return ResponseEntity.ok(
              new ApiResponse("Product added successfully!", productDto));
    } catch (AlreadyExistsException e) {
      return ResponseEntity.status(CONFLICT)
                           .body(new ApiResponse(e.getMessage(), null));
    }
  }

  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @PutMapping("/product/{productId}/update")
  public ResponseEntity<ApiResponse> updateProduct(
          @RequestBody ProductUpdateRequest request,
          @PathVariable Long productId) {
    try {
      Product product = productService.updateProduct(request, productId);
      ProductDto productDto = productService.convertToDto(product);
      return ResponseEntity.ok(
              new ApiResponse("Update product success!", productDto));
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(NOT_FOUND)
                           .body(new ApiResponse(e.getMessage(), null));
    }
  }

  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @DeleteMapping("/product/{productId}/delete")
  public ResponseEntity<ApiResponse> deleteProduct(
          @PathVariable Long productId) {
    try {
      productService.deleteProductById(productId);
      return ResponseEntity.ok(
              new ApiResponse("Delete product success!", productId));
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(NOT_FOUND)
                           .body(new ApiResponse(e.getMessage(), null));
    } catch (CantDeleteException e) {
      return ResponseEntity.ok(new ApiResponse(e.getMessage(), e.getUsers()));
    }
  }

  @GetMapping("/products/by/brand-and-name")
  public ResponseEntity<ApiResponse> getProductByBrandAndName(
          @RequestParam String brandName, @RequestParam String productName) {
    try {
      List<Product> products =
              productService.getProductsByBrandAndName(brandName, productName);
      List<ProductDto> convertedProducts =
              productService.getConvertedProducts(products);
      if (products.isEmpty()) {
        return ResponseEntity.status(NOT_FOUND)
                             .body(new ApiResponse("Product Not Found!", null));
      }
      return ResponseEntity.ok(
              new ApiResponse("Retrieve products by brand and name success!",
                      convertedProducts));
    } catch (Exception e) {
      return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(
              "Error: getProductByBrandAndName ", e.getMessage()));
    }
  }

  @GetMapping("/products/by/category-and-brand")
  public ResponseEntity<ApiResponse> getProductByCategoryAndBrand(
          @RequestParam String category, @RequestParam String brand) {
    try {
      List<Product> products =
              productService.getProductsByCategoryAndBrand(category, brand);
      List<ProductDto> convertedProducts =
              productService.getConvertedProducts(products);
      if (products.isEmpty()) {
        return ResponseEntity.ok(
                new ApiResponse("No products found for the selected filters!",
                        null));
      }
      return ResponseEntity.ok(new ApiResponse(
              "Retrieve products by category and brand success!",
              convertedProducts));
    } catch (Exception e) {
      return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(
              "Error: getProductByCategoryAndBrand ", e.getMessage()));
    }
  }

  @GetMapping("/products/{name}/name")
  public ResponseEntity<ApiResponse> getProductByName(
          @PathVariable String name) {
    try {
      List<Product> products = productService.getProductByName(name);
      if (products.isEmpty()) {
        return ResponseEntity.status(NOT_FOUND)
                             .body(new ApiResponse("Product Not Found!", null));
      }
      List<ProductDto> convertedProducts =
              productService.getConvertedProducts(products);
      return ResponseEntity.ok(
              new ApiResponse("Successfully found the product " + name + "!",
                      convertedProducts));
    } catch (Exception e) {
      return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                           .body(new ApiResponse("Error: getProductByName ",
                                   e.getMessage()));
    }
  }

  @GetMapping("/by-brand")
  public ResponseEntity<ApiResponse> findProductByBrand(
          @RequestParam String brand) {
    try {
      List<Product> products = productService.getProductsByBrand(brand);
      if (products.isEmpty()) {
        return ResponseEntity.status(NOT_FOUND)
                             .body(new ApiResponse("Product Not Found!", null));
      }
      List<ProductDto> convertedProducts =
              productService.getConvertedProducts(products);
      return ResponseEntity.ok(
              new ApiResponse("Retrieve products by brand success!",
                      convertedProducts));
    } catch (Exception e) {
      return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                           .body(new ApiResponse("Error: findProductByBrand ",
                                   e.getMessage()));
    }
  }

  @GetMapping("/by-category")
  public ResponseEntity<ApiResponse> findProductByCategory(
          @RequestParam String category) {
    try {
      List<Product> products = productService.getProductsByCategory(category);
      if (products.isEmpty()) {
        return ResponseEntity.status(NOT_FOUND)
                             .body(new ApiResponse("Products Not Found!",
                                     null));
      }
      List<ProductDto> convertedProducts =
              productService.getConvertedProducts(products);
      return ResponseEntity.ok(
              new ApiResponse("Retrieve products by category success!",
                      convertedProducts));
    } catch (Exception e) {
      return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(
              "Error: findProductByCategory ", e.getMessage()));
    }
  }

  @GetMapping("/products/count/by-brand/and-name")
  public ResponseEntity<ApiResponse> findProductByBrandAndName(
          @RequestParam String brand, @RequestParam String name) {
    try {
      var productsCount =
              productService.countProductsByBrandAndName(brand, name);
      return ResponseEntity.ok(
              new ApiResponse("Retrieve products by brand and name success!",
                      productsCount));
    } catch (Exception e) {
      return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                           .body(new ApiResponse(e.getMessage(), null));
    }
  }

  @GetMapping("/brands")
  public ResponseEntity<ApiResponse> getAllBrands() {
    try {
      List<String> brands = productService.getAllBrands();
      return ResponseEntity.ok(new ApiResponse("Found!", brands));
    } catch (Exception e) {
      return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                           .body(new ApiResponse(e.getMessage(), null));
    }
  }

  @GetMapping("/sort/asc")
  public ResponseEntity<ApiResponse> getProductsSortedByPriceAsc() {
    List<Product> products = productService.getProductsSortedByPriceAsc();
    List<ProductDto> convertedProducts =
            productService.getConvertedProducts(products);
    return ResponseEntity.ok(new ApiResponse(
            "Products sorted by price (ascending) successfully!",
            convertedProducts));
  }

  @GetMapping("/sort/desc")
  public ResponseEntity<ApiResponse> getProductsSortedByPriceDesc() {
    List<Product> products = productService.getProductsSortedByPriceDesc();
    List<ProductDto> convertedProducts =
            productService.getConvertedProducts(products);
    return ResponseEntity.ok(new ApiResponse(
            "Products sorted by price (descending) successfully!",
            convertedProducts));
  }

}
