package com.easyshops.backend.controller;

import com.easyshops.backend.dto.CartDto;
import com.easyshops.backend.dto.CartItemDto;
import com.easyshops.backend.exeptions.ResourceNotFoundException;
import com.easyshops.backend.model.Cart;
import com.easyshops.backend.model.CartItem;
import com.easyshops.backend.response.ApiResponse;
import com.easyshops.backend.service.cart.ICartItemService;
import com.easyshops.backend.service.cart.ICartService;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/cart")
public class CartController {
  private final ICartService cartService;
  private final ICartItemService cartItemService;

  @GetMapping("/{cartId}/my-cart")
  public ResponseEntity<ApiResponse> getCart(@PathVariable Long cartId) {
    try {
      Cart cart = cartService.getCart(cartId);
      CartDto cartDto = cartService.convertToDto(cart);
      return ResponseEntity.ok(new ApiResponse("Cart found", cartDto));
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(NOT_FOUND)
              .body(new ApiResponse(e.getMessage(), null));
    }
  }

  @DeleteMapping("/{cartId}/clear-cart")
  public ResponseEntity<ApiResponse> clearCart(@PathVariable Long cartId) {
    try {
      cartService.clearCart(cartId);
      return ResponseEntity.ok(
              new ApiResponse("Cart cleared successfully", null));
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(NOT_FOUND)
              .body(new ApiResponse(e.getMessage(), null));
    }
  }

  @GetMapping("/{cartId}/total-price")
  public ResponseEntity<ApiResponse> getTotalAmount(@PathVariable Long cartId) {
    try {
      BigDecimal totalPrice = cartService.getTotalPrice(cartId);
      return ResponseEntity.ok(new ApiResponse("Total Price", totalPrice));
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(NOT_FOUND)
              .body(new ApiResponse(e.getMessage(), null));
    }
  }

  @PostMapping("/items/item/add")
  public ResponseEntity<ApiResponse> addItemToCart(
          @RequestParam(required = false) Long cartId,
          @RequestParam Long productId, @RequestParam Integer quantity)
  {
    try {
      Cart cart = cartItemService.addItemToCart(cartId, productId, quantity);
      CartDto cartDto = cartService.convertToDto(cart);
      return ResponseEntity.ok(new ApiResponse("Item added to cart!", cartDto));
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(NOT_FOUND)
              .body(new ApiResponse(e.getMessage(), null));
    } catch (JwtException e) {
      return ResponseEntity.status(UNAUTHORIZED)
              .body(new ApiResponse(e.getMessage(), null));
    }
  }

  @DeleteMapping("/items/{cartId}/item/{itemId}/remove")
  public ResponseEntity<ApiResponse> removeItemFromCart(
          @PathVariable Long cartId, @PathVariable Long itemId)
  {
    try {
      cartItemService.removeItemFromCart(cartId, itemId);
      return ResponseEntity.ok(
              new ApiResponse("Item removed from cart successfully!", null));
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(NOT_FOUND)
              .body(new ApiResponse(e.getMessage(), null));
    }
  }

  @PutMapping("/items/{cartId}/item/{itemId}/update")
  public ResponseEntity<ApiResponse> updateCartItemQuantity(
          @PathVariable Long cartId, @PathVariable Long itemId,
          @RequestParam Integer quantity)
  {
    try {
      cartItemService.updateQuantity(cartId, itemId, quantity);
      return ResponseEntity.ok(
              new ApiResponse("Cart item quantity updated successfully!",
                              null));
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(NOT_FOUND)
              .body(new ApiResponse(e.getMessage(), null));
    }
  }

  @GetMapping("/items/{cartId}/item/{productId}")
  public ResponseEntity<ApiResponse> getItem(@PathVariable Long cartId,
                                             @PathVariable Long productId)
  {
    try {
      CartItem cartItem = cartItemService.getCartItem(cartId, productId);
      CartItemDto cartItemDto = cartItemService.convertToDto(cartItem);
      return ResponseEntity.ok(new ApiResponse("Item found", cartItemDto));
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.ok(new ApiResponse("Not Found !", null));
    }
  }
}
