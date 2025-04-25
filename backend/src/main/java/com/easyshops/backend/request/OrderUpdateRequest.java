package com.easyshops.backend.request;

import com.easyshops.backend.enums.OrderStatus;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderUpdateRequest {
  private Long id;
  private BigDecimal totalAmount;
  private OrderStatus status;
}
