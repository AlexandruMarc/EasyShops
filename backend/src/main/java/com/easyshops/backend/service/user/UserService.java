package com.easyshops.backend.service.user;

import com.easyshops.backend.repository.RoleRepository;
import com.easyshops.backend.dto.RoleDto;
import com.easyshops.backend.dto.UserDto;
import com.easyshops.backend.exeptions.AlreadyExistsException;
import com.easyshops.backend.exeptions.ResourceNotFoundException;
import com.easyshops.backend.model.Role;
import com.easyshops.backend.model.User;
import com.easyshops.backend.repository.UserRepository;
import com.easyshops.backend.request.CreateUserRequest;
import com.easyshops.backend.request.UserUpdateRequest;
import com.easyshops.backend.service.cart.CartService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
  private final UserRepository userRepository;
  private final ModelMapper modelMapper;
  private final PasswordEncoder passwordEncoder;
  private final RoleRepository roleRepository;
  private final CartService cartService;


  @Override
  public User getUserById(Long userId) {
    return userRepository.findById(userId).orElseThrow(
            () -> new ResourceNotFoundException("User not found"));
  }

  @Override
  public User getUserByEmail(String email) {
    return userRepository.findByEmail(email);
  }


  @Override
  public User createUser(CreateUserRequest request) {
    Role userRole = roleRepository.findByName("ROLE_USER").get();
    return Optional.of(request).filter(user -> !userRepository.existsByEmail(
            request.getEmail())).map(req -> {
      User user = new User();
      user.setEmail(request.getEmail());
      user.setPassword(passwordEncoder.encode(request.getPassword()));
      user.setFirstName(request.getFirstName());
      user.setLastName(request.getLastName());
      user.setRoles(Set.of(userRole));

      User savedUser = userRepository.save(user);
      cartService.initializeNewCart(savedUser);
      return savedUser;
    }).orElseThrow(() -> new AlreadyExistsException(
            "Oops! This email already exists !"));
  }

  @Override
  public User updateUser(UserUpdateRequest request, Long userId) {
    return userRepository.findById(userId).map(existingUser -> {
      existingUser.setEmail(request.getEmail());
      existingUser.setFirstName(request.getFirstName());
      existingUser.setLastName(request.getLastName());

      // Fetch the existing role from the database
      Role existingRole = roleRepository.findByName(request.getRole().getName())
                                        .orElseThrow(
                                                () -> new ResourceNotFoundException(
                                                        "Role not found!"));

      // Assign the existing role to the user
      existingUser.setRoles(new HashSet<>(Set.of(existingRole)));

      return userRepository.save(existingUser);
    }).orElseThrow(() -> new ResourceNotFoundException("User not found!"));
  }

  @Override
  public List<User> getUsers() {
    return userRepository.findAll();
  }

  @Override
  public void changePassword(String oldPassword, String newPassword) {
    User user = getAuthenticatedUser();
    if (passwordEncoder.matches(oldPassword.trim(), user.getPassword())) {
      user.setPassword(passwordEncoder.encode(newPassword));
      userRepository.save(user);
    } else {
      throw new IllegalArgumentException("Invalid old password");
    }
  }

  @Override
  public void deleteUser(Long userId) {
    userRepository.findById(userId)
                  .ifPresentOrElse(userRepository::delete, () -> {
                    throw new ResourceNotFoundException("User not found");
                  });
  }

  @Override
  public List<UserDto> getConvertedUsers(List<User> users) {
    return users.stream().map(this::convertUserToDto).collect(toList());
  }

  @Override
  public UserDto convertUserToDto(User user) {
    Converter<Collection<Role>, List<String>> rolesConverter =
            ctx -> ctx.getSource().stream().map(Role::getName)
                      .collect(Collectors.toList());

    modelMapper.typeMap(User.class, UserDto.class).addMappings(
            mapper -> mapper.using(rolesConverter)
                            .map(User::getRoles, UserDto::setRoles));
    return modelMapper.map(user, UserDto.class);
  }


  @Override
  public User getAuthenticatedUser() {
    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();
    String email = authentication.getName();
    return userRepository.findByEmail(email);
  }

  @Override
  public List<RoleDto> getAllRoles() {
    List<Role> roles = roleRepository.findAll();
    return roles.stream().map(this::convertRoleToDto)
                .collect(Collectors.toList());
  }

  private RoleDto convertRoleToDto(Role role) {
    return modelMapper.map(role, RoleDto.class);
  }

}
