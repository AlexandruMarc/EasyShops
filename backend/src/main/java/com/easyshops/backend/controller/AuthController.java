package com.easyshops.backend.controller;

import com.easyshops.backend.request.LoginRequest;
import com.easyshops.backend.response.ApiResponse;
import com.easyshops.backend.response.JwtResponse;
import com.easyshops.backend.security.jwt.JwtUtils;
import com.easyshops.backend.security.user.ShopUserDetails;
import com.easyshops.backend.security.user.ShopUserDetailsService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/auth")
public class AuthController {
  private final AuthenticationManager authenticationManager;
  private final JwtUtils jwtUtils;
  private final ShopUserDetailsService userDetailsService;

  @PostMapping("/login")
  public ResponseEntity<ApiResponse> login(@Valid @RequestBody
                                           LoginRequest request, HttpServletResponse response) {
    try {
      Authentication authentication = authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(request.getEmail(),
                      request.getPassword()));
      SecurityContextHolder.getContext().setAuthentication(authentication);

      String jwt = jwtUtils.generateTokenForUser(authentication);
      ShopUserDetails userDetails =
              (ShopUserDetails) authentication.getPrincipal();
      JwtResponse jwtResponse =
              new JwtResponse(userDetails.getId(), jwt, userDetails.getEmail(),
                      userDetails.getAuthorities().iterator().next()
                                 .getAuthority(), userDetails.getCartId());

      // Set the JWT as an HTTP‑only cookie
      Cookie cookie = new Cookie("token", jwt);
      cookie.setHttpOnly(true);
      cookie.setSecure(false);
      cookie.setPath("/");
      cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days in seconds
      response.addCookie(cookie);

      return ResponseEntity.ok(
              new ApiResponse("Logged in successfully", jwtResponse));
    } catch (AuthenticationException e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                           .body(new ApiResponse(e.getMessage(), null));
    }
  }

  @GetMapping("/session")
  public ResponseEntity<ApiResponse> getSession(HttpServletRequest request) {
    String token = Arrays.stream(request.getCookies())
                         .filter(cookie -> "token".equals(cookie.getName()))
                         .findFirst().map(Cookie::getValue).orElse(null);

    if (token == null || !jwtUtils.validateToken(token)) {
      return ResponseEntity.ok(new ApiResponse("Session expired", null));
    }

    String userEmail = jwtUtils.getUsernameFromToken(token);
    ShopUserDetails userDetails =
            (ShopUserDetails) userDetailsService.loadUserByUsername(userEmail);

    if (userDetails == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                           .body(new ApiResponse("User not found", null));
    }

    return ResponseEntity.ok(new ApiResponse("Session valid", userDetails));
  }

  @PostMapping("/logout")
  public ResponseEntity<ApiResponse> logout(HttpServletResponse response) {
    // Clear the JWT cookie
    Cookie cookie = new Cookie("token", null);
    cookie.setHttpOnly(true);
    cookie.setSecure(false);
    cookie.setPath("/");
    cookie.setMaxAge(0); // Expire the cookie immediately
    response.addCookie(cookie);

    return ResponseEntity.ok(new ApiResponse("Logged out successfully", null));
  }
}
