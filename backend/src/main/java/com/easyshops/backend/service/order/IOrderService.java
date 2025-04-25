package com.easyshops.backend.service.order;

import com.easyshops.backend.dto.OrderDto;
import com.easyshops.backend.model.Order;
import com.easyshops.backend.request.OrderUpdateRequest;

import java.util.List;


public interface IOrderService {
  Order placeOrder(Long userId, Long addressId);

  Order updateOrder(OrderUpdateRequest updateRequest);

  OrderDto getOrderById(Long orderId);

  List<OrderDto> getOrdersByUserId(Long userId);

  OrderDto convertToDto(Order order);
}
