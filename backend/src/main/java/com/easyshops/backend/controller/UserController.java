package com.easyshops.backend.controller;

import com.easyshops.backend.dto.RoleDto;
import com.easyshops.backend.dto.UserDto;
import com.easyshops.backend.exeptions.ResourceNotFoundException;
import com.easyshops.backend.model.User;
import com.easyshops.backend.request.ChangePasswordRequest;
import com.easyshops.backend.request.CreateUserRequest;
import com.easyshops.backend.request.UserUpdateRequest;
import com.easyshops.backend.response.ApiResponse;
import com.easyshops.backend.service.user.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/users")
public class UserController {
  private final IUserService userService;

  @GetMapping("/all")
  public ResponseEntity<ApiResponse> getAllUsers() {
    List<User> users = userService.getUsers();
    List<UserDto> usersDto = userService.getConvertedUsers(users);
    return ResponseEntity.ok(new ApiResponse("Success", usersDto));
  }

  @GetMapping("/{userId}/user")
  public ResponseEntity<ApiResponse> getUserById(@PathVariable Long userId) {
    try {
      User user = userService.getUserById(userId);
      UserDto userDto = userService.convertUserToDto(user);
      return ResponseEntity.ok(new ApiResponse("Success", userDto));
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(NOT_FOUND)
                           .body(new ApiResponse(e.getMessage(), null));
    }
  }

  @PostMapping("/create/user")
  public ResponseEntity<ApiResponse> createUser(
          @RequestBody CreateUserRequest request) {
    try {
      User user = userService.createUser(request);
      UserDto userDto = userService.convertUserToDto(user);
      return ResponseEntity.ok(
              new ApiResponse("User created successfully!", userDto));
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(CONFLICT)
                           .body(new ApiResponse(e.getMessage(), null));
    }
  }

  @PostMapping("/change/password")
  public ResponseEntity<ApiResponse> changePassword(
          @RequestBody ChangePasswordRequest request) {
    try {
      userService.changePassword(request.getOldPassword(),
              request.getNewPassword());
      return ResponseEntity.ok(new ApiResponse("Password changed", null));
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(BAD_REQUEST)
                           .body(new ApiResponse(e.getMessage(), null));
    }
  }

  @PutMapping("/update/{userId}/user")
  public ResponseEntity<ApiResponse> updateUser(
          @RequestBody UserUpdateRequest request, @PathVariable Long userId) {
    try {
      User updatedUser = userService.updateUser(request, userId);
      UserDto userDto = userService.convertUserToDto(updatedUser);
      return ResponseEntity.ok(
              new ApiResponse("User updated successfully!", userDto));
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(NOT_FOUND)
                           .body(new ApiResponse(e.getMessage(), null));
    }
  }

  @DeleteMapping("/delete/{userId}/user")
  public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long userId) {
    try {
      userService.deleteUser(userId);
      return ResponseEntity.ok(
              new ApiResponse("User deleted successfully!", null));
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(NOT_FOUND)
                           .body(new ApiResponse(e.getMessage(), null));
    }
  }

  @GetMapping("/roles/all")
  public ResponseEntity<ApiResponse> getRoles() {
    List<RoleDto> roles = userService.getAllRoles();
    return ResponseEntity.ok(new ApiResponse("Success", roles));
  }
}
