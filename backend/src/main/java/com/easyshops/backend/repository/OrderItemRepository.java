package com.easyshops.backend.repository;

import com.easyshops.backend.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
  List<OrderItem> findByProductId(Long id);
}
