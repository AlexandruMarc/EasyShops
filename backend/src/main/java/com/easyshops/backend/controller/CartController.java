package com.easyshops.backend.controller;

import com.easyshops.backend.dto.CartDto;
import com.easyshops.backend.exeptions.ResourceNotFoundException;
import com.easyshops.backend.model.Cart;
import com.easyshops.backend.response.ApiResponse;
import com.easyshops.backend.service.cart.ICartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/cart")
public class CartController {
  private final ICartService cartService;

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
}
