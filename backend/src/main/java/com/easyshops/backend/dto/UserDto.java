package com.easyshops.backend.dto;

import com.easyshops.backend.model.Role;
import lombok.Data;

import java.util.List;

@Data
public class UserDto {
  private Long id;
  private String firstName;
  private String lastName;
  private String email;
  private List<Role> roles;
  private List<OrderDto> orders;
  private CartDto cart;
  private List<AddressDto> addresses;
  private ImageDto image;
}
