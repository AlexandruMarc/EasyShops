package com.easyshops.backend.service.product;

import com.easyshops.backend.dto.ImageDto;
import com.easyshops.backend.dto.ProductDto;
import com.easyshops.backend.dto.UserDto;
import com.easyshops.backend.exeptions.AlreadyExistsException;
import com.easyshops.backend.exeptions.CantDeleteException;
import com.easyshops.backend.exeptions.ResourceNotFoundException;
import com.easyshops.backend.model.*;
import com.easyshops.backend.repository.*;
import com.easyshops.backend.request.AddProductRequest;
import com.easyshops.backend.request.ProductUpdateRequest;
import com.easyshops.backend.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class ProductService implements IProductService {
  private final ProductRepository productRepository;
  private final CategoryRepository categoryRepository;
  private final ImageRepository imageRepository;
  private final CartItemRepository cartItemRepository;
  private final ModelMapper modelMapper;
  private final UserService userService;
  private final OrderItemRepository orderItemRepository;

  @Override
  public Product addProduct(AddProductRequest request) {
    if (productExists(request.getName(), request.getBrand())) {
      throw new AlreadyExistsException(
              "Product with this name: " + request.getName() + " and brand: " +
              request.getBrand() +
              " already exists! You may update this product instead!");
    }

    Category category = Optional.ofNullable(
            categoryRepository.findByNameIgnoreCase(
                    request.getCategory().getName())).orElseGet(() -> {
      Category newCategory = new Category(request.getCategory().getName());
      return categoryRepository.save(newCategory);
    });
    request.setCategory(category);
    return productRepository.save(createProduct(request, category));
  }

  private Product createProduct(AddProductRequest request, Category category) {
    return new Product(request.getName(), request.getBrand(),
            request.getPrice(), request.getInventory(),
            request.getDescription(), category);
  }

  @Override
  public Product getProductById(Long id) {
    return productRepository.findById(id).orElseThrow(
            () -> new ResourceNotFoundException("Product not found!"));
  }

  @Override
  @Transactional
  public void deleteProductById(Long id) {
    Product product = productRepository.findById(id).orElseThrow(
            () -> new ResourceNotFoundException("Product not found!"));
    List<CartItem> cartItems = cartItemRepository.findByProductId(id);

    if (!cartItems.isEmpty()) {
      String customerEmails = cartItems.stream()
                                       .map(item -> item.getCart().getUser()
                                                        .getEmail()).distinct()
                                       .collect(Collectors.joining(", "));

      List<User> users =
              cartItems.stream().map(item -> item.getCart().getUser())
                       .collect(toList());
      List<UserDto> usersDto = userService.getConvertedUsers(users);
      throw new CantDeleteException(
              "You can't delete this product because it is present in the cart of customers: " +
              customerEmails, usersDto);
    }

    List<OrderItem> orderItems = orderItemRepository.findByProductId(id);
    if (!orderItems.isEmpty()) {
      for (OrderItem orderItem : orderItems) {
        // Salvează snapshot-ul datelor produsului
        orderItem.setName(product.getName());
        orderItem.setBrand(product.getBrand());
        orderItem.setProductPrice(product.getPrice());
        orderItem.setProductDescription(product.getDescription());
        if (product.getCategory() != null) {
          orderItem.setProductCategoryName(product.getCategory().getName());
        }
        // Deconectează referința la produs
        orderItem.setProduct(null);
        orderItemRepository.save(orderItem);
      }
    }

    productRepository.delete(product);
  }


  @Override
  public Product updateProduct(ProductUpdateRequest request, Long productId) {
    return productRepository.findById(productId)
                            .map(existingProduct -> updateExistingProduct(
                                    existingProduct, request))
                            .map(productRepository::save).orElseThrow(
                    () -> new ResourceNotFoundException("Product not found!"));
  }

  private Product updateExistingProduct(Product existingProduct, ProductUpdateRequest request) {
    existingProduct.setName(request.getName());
    existingProduct.setPrice(request.getPrice());
    existingProduct.setBrand(request.getBrand());
    existingProduct.setInventory(request.getInventory());
    existingProduct.setDescription(request.getDescription());

    Category category = categoryRepository.findByNameIgnoreCase(
            request.getCategory().getName());
    existingProduct.setCategory(category);
    return existingProduct;
  }

  private boolean productExists(String name, String brand) {
    return productRepository.existsByNameAndBrand(name, brand);
  }

  @Override
  public List<Product> getAllProducts() {
    return productRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
  }

  @Override
  public List<Product> getProductsByCategory(String category) {
    return productRepository.findByCategoryNameIgnoreCase(category);
  }

  @Override
  public List<String> getAllBrands() {
    return productRepository.findDistinctBrands();
  }

  @Override
  public List<Product> getProductsByBrand(String brand) {
    return productRepository.findByBrandIgnoreCase(brand);
  }

  @Override
  public List<Product> getProductsByCategoryAndBrand(String category, String brand) {
    return productRepository.findByCategoryNameAndBrandIgnoreCase(category,
            brand);
  }

  @Override
  public List<Product> getProductByName(String name) {
    return productRepository.findByNameContainingIgnoreCase(name);
  }

  @Override
  public List<Product> getProductsByBrandAndName(String brand, String name) {
    return productRepository.findByBrandAndNameIgnoreCase(brand, name);
  }

  @Override
  public Long countProductsByBrandAndName(String brand, String name) {
    return productRepository.countByBrandAndNameIgnoreCase(brand, name);
  }

  @Override
  public List<ProductDto> getConvertedProducts(List<Product> products) {
    return products.stream().map(this::convertToDto).collect(toList());
  }

  @Override
  public ProductDto convertToDto(Product product) {
    ProductDto productDto = modelMapper.map(product, ProductDto.class);
    List<Image> images = imageRepository.findByProductId(product.getId());
    List<ImageDto> imageDtos =
            images.stream().map(image -> modelMapper.map(image, ImageDto.class))
                  .toList();
    productDto.setImages(imageDtos);
    return productDto;
  }

  @Override
  public List<Product> getProductsSortedByPriceAsc() {
    return productRepository.findAll(Sort.by(Sort.Direction.ASC, "price"));
  }

  @Override
  public List<Product> getProductsSortedByPriceDesc() {
    return productRepository.findAll(Sort.by(Sort.Direction.DESC, "price"));
  }


}
