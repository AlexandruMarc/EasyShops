package com.easyshops.backend.service.user;

import com.easyshops.backend.dto.RoleDto;
import com.easyshops.backend.dto.UserDto;
import com.easyshops.backend.model.User;
import com.easyshops.backend.request.CreateUserRequest;
import com.easyshops.backend.request.UserUpdateRequest;

import java.util.List;

public interface IUserService {
  User getUserById(Long userId);

  User getUserByEmail(String email);

  User createUser(CreateUserRequest request);

  User updateUser(UserUpdateRequest request, Long userId);

  List<User> getUsers();

  void changePassword(String oldPassword, String newPassword);

  void deleteUser(Long userId);

  List<UserDto> getConvertedUsers(List<User> users);

  UserDto convertUserToDto(User user);

  User getAuthenticatedUser();

  List<RoleDto> getAllRoles();
}
