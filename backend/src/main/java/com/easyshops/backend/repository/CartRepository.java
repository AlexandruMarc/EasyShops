package com.easyshops.backend.repository;

import com.easyshops.backend.model.Cart;
import com.easyshops.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {
  Cart findByUserId(Long userId);

  boolean existsByUser(User user);
}
