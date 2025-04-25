package com.easyshops.backend.service.cart;

import com.easyshops.backend.dto.CartDto;
import com.easyshops.backend.dto.CartItemDto;
import com.easyshops.backend.exeptions.ResourceNotFoundException;
import com.easyshops.backend.model.Cart;
import com.easyshops.backend.model.User;
import com.easyshops.backend.repository.CartItemRepository;
import com.easyshops.backend.repository.CartRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService implements ICartService {
  private final CartRepository cartRepository;
  private final CartItemRepository cartItemRepository;
  private final ModelMapper modelMapper;

  @Override
  public Cart getCart(Long id) {
    Cart cart = cartRepository.findById(id).orElseThrow(
            () -> new ResourceNotFoundException("Cart not found"));
    BigDecimal totalAmount = cart.getTotalAmount();
    cart.setTotalAmount(totalAmount);
    return cartRepository.save(cart);
  }

  @Transactional
  @Override
  public void clearCart(Long id) {
    Cart cart = getCart(id);
    cartItemRepository.deleteAllByCartId(id);
    cart.getItems().clear();
    cartRepository.deleteById(id);
  }

  @Override
  public BigDecimal getTotalPrice(Long id) {
    Cart cart = getCart(id);
    return cart.getTotalAmount();
  }

  @Override
  public Cart initializeNewCart(User user) {
    return Optional.ofNullable(getCartByUserId(user.getId())).orElseGet(() -> {
      Cart cart = new Cart();
      cart.setUser(user);
      return cartRepository.save(cart);
    });
  }

  public boolean existsByUser(User user) {
    return cartRepository.existsByUser(user);
  }

  @Override
  public Cart getCartByUserId(Long userId) {
    return cartRepository.findByUserId(userId);
  }

  @Override
  public CartDto convertToDto(Cart cart) {
    CartDto cartDto = modelMapper.map(cart, CartDto.class);
    Set<CartItemDto> cartItemDtos = cart.getItems().stream()
                                        .map(cartItem -> modelMapper.map(
                                                cartItem, CartItemDto.class))
                                        .collect(Collectors.toSet());
    cartDto.setItems(cartItemDtos);
    return cartDto;
  }

}
