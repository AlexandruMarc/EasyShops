package com.easyshops.backend.service.product;

import com.easyshops.backend.dto.ProductDto;
import com.easyshops.backend.model.Product;
import com.easyshops.backend.request.AddProductRequest;
import com.easyshops.backend.request.ProductUpdateRequest;

import java.util.List;

public interface IProductService {
  Product addProduct(AddProductRequest request);

  Product getProductById(Long id);

  void deleteProductById(Long id);

  Product updateProduct(ProductUpdateRequest request, Long productId);

  List<Product> getAllProducts();

  List<Product> getProductsByCategory(String category);

  List<Product> getProductsByBrand(String brand);

  List<Product> getProductsByCategoryAndBrand(String category, String brand);

  List<Product> getProductByName(String name);

  List<Product> getProductsByBrandAndName(String brand, String name);

  Long countProductsByBrandAndName(String brand, String name);

  List<ProductDto> getConvertedProducts(List<Product> products);

  ProductDto convertToDto(Product product);

  List<String> getAllBrands();
  
  List<Product> getProductsSortedByPriceAsc();

  List<Product> getProductsSortedByPriceDesc();
}
