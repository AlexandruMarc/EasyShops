package com.easyshops.backend.request;

import lombok.Data;

@Data
public class CreateAddressRequest {
  private String street;
  private String city;
  private String county;
  private String country;
  private String zipCode;
}