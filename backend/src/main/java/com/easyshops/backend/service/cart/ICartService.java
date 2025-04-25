package com.easyshops.backend.service.cart;

import com.easyshops.backend.dto.CartDto;
import com.easyshops.backend.model.Cart;
import com.easyshops.backend.model.User;

import java.math.BigDecimal;

public interface ICartService {
  Cart getCart(Long id);

  void clearCart(Long id);

  BigDecimal getTotalPrice(Long id);

  Cart initializeNewCart(User user);

  Cart getCartByUserId(Long userId);

  CartDto convertToDto(Cart cart);
}
