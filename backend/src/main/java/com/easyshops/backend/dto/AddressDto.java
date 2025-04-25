package com.easyshops.backend.dto;

import lombok.Data;

@Data
public class AddressDto {
  private Long addressId;
  private String street;
  private String city;
  private String county;
  private String country;
  private String zipCode;
}
