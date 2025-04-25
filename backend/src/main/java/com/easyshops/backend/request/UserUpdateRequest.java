package com.easyshops.backend.request;

import com.easyshops.backend.model.Role;
import lombok.Data;

@Data
public class UserUpdateRequest {
  private String email;
  private String firstName;
  private String lastName;
  private Role role;
}
