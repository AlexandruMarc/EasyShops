package com.easyshops.backend.exeptions;

import com.easyshops.backend.dto.UserDto;

import java.util.List;

public class CantDeleteException extends RuntimeException {
  private final List<UserDto> users;

  public CantDeleteException(String message, List<UserDto> users) {
    super(message);
    this.users = users;
  }

  public List<UserDto> getUsers() {
    return users;
  }
}

