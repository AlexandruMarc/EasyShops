package com.easyshops.backend.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JwtResponse {
  private Long id;
  private String token;
  private String email;
  private String role;
  private Long cartId;
}
