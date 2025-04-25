package com.easyshops.backend.controller;

import com.easyshops.backend.dto.OrderDto;
import com.easyshops.backend.exeptions.ResourceNotFoundException;
import com.easyshops.backend.model.Order;
import com.easyshops.backend.request.OrderUpdateRequest;
import com.easyshops.backend.response.ApiResponse;
import com.easyshops.backend.service.order.IOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/orders")
public class OrderController {
  private final IOrderService orderService;

  @PostMapping("/order")
  public ResponseEntity<ApiResponse> createOrder(
          @RequestParam Long userId, @RequestParam Long addressId) {
    try {
      Order order = orderService.placeOrder(userId, addressId);
      OrderDto orderDto = orderService.convertToDto(order);
      return ResponseEntity.ok(
              new ApiResponse("Order created successfully!", orderDto));
    } catch (Exception e) {
      return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                           .body(new ApiResponse("Error creating order",
                                   e.getMessage()));
    }
  }

  @GetMapping("/{orderId}/order")
  public ResponseEntity<ApiResponse> getOrderById(@PathVariable Long orderId) {
    try {
      OrderDto order = orderService.getOrderById(orderId);
      return ResponseEntity.ok(
              new ApiResponse("Order retrieved successfully!", order));
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(NOT_FOUND)
                           .body(new ApiResponse("Oops! ", e.getMessage()));
    }
  }

  @PutMapping("/{orderId}/update")
  public ResponseEntity<ApiResponse> updateOrder(
          @PathVariable Long orderId,
          @RequestBody OrderUpdateRequest updateRequest) {
    if (!orderId.equals(updateRequest.getId())) {
      return ResponseEntity.badRequest()
                           .body(new ApiResponse("Order ID mismatch", null));
    }
    try {
      Order order = orderService.updateOrder(updateRequest);
      OrderDto updatedOrderDto = orderService.convertToDto(order);
      return ResponseEntity.ok(
              new ApiResponse("Order updated successfully!", updatedOrderDto));
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(NOT_FOUND)
                           .body(new ApiResponse(e.getMessage(), null));
    } catch (Exception e) {
      return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                           .body(new ApiResponse("Error updating order",
                                   e.getMessage()));
    }
  }

  @GetMapping("/{userId}/user-orders")
  public ResponseEntity<ApiResponse> getUserOrders(@PathVariable Long userId) {
    try {
      List<OrderDto> userOrders = orderService.getOrdersByUserId(userId);
      return ResponseEntity.ok(
              new ApiResponse("User orders retrieved successfully!",
                      userOrders));
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(NOT_FOUND)
                           .body(new ApiResponse("User not found!", null));
    } catch (Exception e) {
      return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                           .body(new ApiResponse("Error retrieving user orders",
                                   e.getMessage()));
    }
  }
}
