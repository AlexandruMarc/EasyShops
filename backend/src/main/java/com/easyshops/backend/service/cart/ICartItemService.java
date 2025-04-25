package com.easyshops.backend.service.cart;

import com.easyshops.backend.dto.CartItemDto;
import com.easyshops.backend.model.Cart;
import com.easyshops.backend.model.CartItem;

public interface ICartItemService {
  Cart addItemToCart(Long cartId, Long productId, int quantity);

  void removeItemFromCart(Long cartId, Long productId);

  void updateQuantity(Long cartId, Long productId, int quantity);

  CartItem getCartItem(Long cartId, Long productId);

  CartItemDto convertToDto(CartItem item);
}
