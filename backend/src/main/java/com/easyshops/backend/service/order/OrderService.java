package com.easyshops.backend.service.order;

import com.easyshops.backend.dto.AddressDto;
import com.easyshops.backend.dto.OrderDto;
import com.easyshops.backend.enums.OrderStatus;
import com.easyshops.backend.exeptions.ResourceNotFoundException;
import com.easyshops.backend.model.Address;
import com.easyshops.backend.model.Cart;
import com.easyshops.backend.model.Order;
import com.easyshops.backend.model.OrderItem;
import com.easyshops.backend.model.Product;
import com.easyshops.backend.repository.OrderRepository;
import com.easyshops.backend.repository.ProductRepository;
import com.easyshops.backend.request.OrderUpdateRequest;
import com.easyshops.backend.service.adress.AddressService;
import com.easyshops.backend.service.cart.CartService;
import com.easyshops.backend.service.mail.IEmailService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService {
  private final OrderRepository orderRepository;
  private final ProductRepository productRepository;
  private final CartService cartService;
  private final AddressService addressService;
  private final ModelMapper modelMapper;
  private final IEmailService emailService;

  @Override
  public Order placeOrder(Long userId, Long addressId) {
    Cart cart = cartService.getCartByUserId(userId);
    Address address = addressService.getAddressById(addressId);
    Order order = createOrder(cart, address);
    List<OrderItem> orderItemList = createOrderItems(order, cart);
    order.setOrderItems(new HashSet<>(orderItemList));
    order.setTotalAmount(calculateTotalAmount(orderItemList));
    Order savedOrder = orderRepository.save(order);

    cartService.clearCart(cart.getId());

    // Send confirmation email
    try {
      String emailBody = generateOrderEmailBody(savedOrder);
      emailService.sendOrderConfirmationEmail(savedOrder.getUser().getEmail(),
              "Order Confirmation - Easy Shops", emailBody);
    } catch (MessagingException e) {
      // Log the error but don't fail the order placement
      System.err.println(
              "Failed to send order confirmation email: " + e.getMessage());
    }

    return savedOrder;
  }

  private String generateOrderEmailBody(Order order) {
    StringBuilder body = new StringBuilder();
    body.append("<h1>Thank you for your order!</h1>");
    body.append("<p>Order ID: ").append(order.getOrderId()).append("</p>");
    body.append("<p>Total Amount: $").append(order.getTotalAmount())
        .append("</p>");
    body.append("<h3>Order Details:</h3>");
    body.append("<ul>");
    for (OrderItem item : order.getOrderItems()) {
      body.append("<li>").append(item.getProduct().getName())
          .append(" - Quantity: ").append(item.getQuantity())
          .append(" - Price: $").append(item.getPrice()).append("</li>");
    }
    body.append("</ul>");
    body.append("<p>We hope you enjoy your purchase!</p>");
    return body.toString();
  }

  private Order createOrder(Cart cart, Address address) {
    Order order = new Order();
    order.setUser(cart.getUser());
    order.setOrderStatus(OrderStatus.PENDING);
    order.setOrderDate(LocalDate.now());
    order.setAddress(address);

    return order;
  }

  private List<OrderItem> createOrderItems(Order order, Cart cart) {
    return cart.getItems().stream().map(cartItem -> {
      Product product = cartItem.getProduct();
      product.setInventory(product.getInventory() - cartItem.getQuantity());
      productRepository.save(product);
      return new OrderItem(product, cartItem.getQuantity(),
              cartItem.getUnitPrice(), order);
    }).toList();
  }

  @Override
  public Order updateOrder(OrderUpdateRequest updateRequest) {
    Order order = orderRepository.findById(updateRequest.getId()).orElseThrow(
            () -> new ResourceNotFoundException(
                    "Order not found with id: " + updateRequest.getId()));
    order.setTotalAmount(updateRequest.getTotalAmount());
    order.setOrderStatus(updateRequest.getStatus());
    return orderRepository.save(order);
  }

  private BigDecimal calculateTotalAmount(List<OrderItem> orderItemList) {
    return orderItemList.stream().map(item -> item.getPrice().multiply(
                                new BigDecimal(item.getQuantity())))
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
  }

  @Override
  public OrderDto getOrderById(Long orderId) {
    return orderRepository.findById(orderId).map(this::convertToDto)
                          .orElseThrow(() -> new ResourceNotFoundException(
                                  "No order found!"));
  }

  @Override
  public List<OrderDto> getOrdersByUserId(Long userId) {
    List<Order> orders = orderRepository.findByUserId(userId);
    return orders.stream().map(this::convertToDto).collect(Collectors.toList());
  }

  @Override
  public OrderDto convertToDto(Order order) {
    OrderDto orderDto = modelMapper.map(order, OrderDto.class);
    AddressDto addressDto =
            modelMapper.map(order.getAddress(), AddressDto.class);
    orderDto.setOrderAddress(addressDto);
    return orderDto;
  }
}
