package com.easyshops.backend.repository;

import com.easyshops.backend.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
  void deleteAllByCartId(Long id);

  Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);

  List<CartItem> findByProductId(Long id);
}
