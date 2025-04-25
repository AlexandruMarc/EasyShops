package com.easyshops.backend.service.cart;

import com.easyshops.backend.dto.CartItemDto;
import com.easyshops.backend.exeptions.ResourceNotFoundException;
import com.easyshops.backend.model.Cart;
import com.easyshops.backend.model.CartItem;
import com.easyshops.backend.model.Product;
import com.easyshops.backend.repository.CartItemRepository;
import com.easyshops.backend.repository.CartRepository;
import com.easyshops.backend.service.product.IProductService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CartItemService implements ICartItemService {
  private final CartItemRepository cartItemRepository;
  private final CartRepository cartRepository;
  private final IProductService productService;
  private final ICartService cartService;
  private final ModelMapper modelMapper;

  @Override
  public Cart addItemToCart(Long cartId, Long productId, int quantity) {
    Cart cart = cartService.getCart(cartId);
    Product product = productService.getProductById(productId);
    CartItem cartItem = cart.getItems().stream()
                            .filter(item -> item.getProduct().getId()
                                                .equals(productId)).findFirst()
                            .orElse(new CartItem());
    if (product.getInventory() < cartItem.getQuantity() + quantity) {
      throw new IllegalStateException("Not enough items in stock");
    }

    if (cartItem.getId() == null) {
      cartItem.setCart(cart);
      cartItem.setProduct(product);
      cartItem.setQuantity(quantity);
      cartItem.setUnitPrice(product.getPrice());
    } else {
      cartItem.setQuantity(cartItem.getQuantity() + quantity);
    }
    cartItem.setTotalPrice();
    cart.addItem(cartItem);
    cartItemRepository.save(cartItem);
    cartRepository.save(cart);
    return cartService.getCart(cartId);
  }

  @Override
  public void removeItemFromCart(Long cartId, Long productId) {
    Cart cart = cartService.getCart(cartId);
    CartItem cartItemToRemove = getCartItem(cartId, productId);
    cart.removeItem(cartItemToRemove);
    cartRepository.save(cart);
  }

  @Override
  @Transactional
  public void updateQuantity(Long cartId, Long productId, int quantity) {
    CartItem cartItem =
            cartItemRepository.findByCartIdAndProductId(cartId, productId)
                              .orElseThrow(() -> new ResourceNotFoundException(
                                      "Cart item not found"));
    cartItem.setQuantity(quantity);
    cartItem.setUnitPrice(cartItem.getProduct().getPrice());
    cartItem.setTotalPrice();
    cartItemRepository.save(cartItem);

    Cart cart = cartService.getCart(cartId);
    BigDecimal totalAmount =
            cart.getItems().stream().map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    cart.setTotalAmount(totalAmount);
    cartRepository.save(cart);
  }

  @Override
  public CartItem getCartItem(Long cartId, Long productId) {
    Cart cart = cartService.getCart(cartId);
    return cart.getItems().stream()
               .filter(item -> item.getProduct().getId().equals(productId))
               .findFirst().orElseThrow(
                    () -> new ResourceNotFoundException("Product not found!"));
  }

  @Override
  public CartItemDto convertToDto(CartItem item) {
    return modelMapper.map(item, CartItemDto.class);
  }
}
