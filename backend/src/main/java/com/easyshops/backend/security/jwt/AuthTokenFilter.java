package com.easyshops.backend.security.jwt;

import com.easyshops.backend.security.user.ShopUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class AuthTokenFilter extends OncePerRequestFilter {
  @Autowired
  private JwtUtils jwtUtils;
  @Autowired
  private ShopUserDetailsService userDetailsService;

  /**
   * This method is called for every request to check if the JWT token is present and valid.
   * If valid, it sets the authentication in the security context.
   */
  @Override
  protected void doFilterInternal(
          @NonNull HttpServletRequest request,
          @NonNull HttpServletResponse response,
          @NonNull FilterChain filterChain) throws ServletException,
          IOException {
    try {
      String jwt = parseJwt(request);
      if (StringUtils.hasText(jwt) && jwtUtils.validateToken(jwt)) {
        String username = jwtUtils.getUsernameFromToken(jwt);
        UserDetails userDetails =
                userDetailsService.loadUserByUsername(username);
        var auth = new UsernamePasswordAuthenticationToken(userDetails, null,
                userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);
      }
    } catch (Exception e) {
      // Log the exception and continue without blocking the request.
      System.err.println("AuthTokenFilter error: " + e.getMessage());
    }
    // Continue processing the filter chain regardless of token errors
    filterChain.doFilter(request, response);
  }

  /**
   * Parses the JWT token from the Authorization header or cookies.
   */
  private String parseJwt(HttpServletRequest request) {
    // Try to retrieve the token from the Authorization header
    String headerAuth = request.getHeader("Authorization");
    if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
      return headerAuth.substring(7);
    }

    // If not found in header, try from cookies
    if (request.getCookies() != null) {
      for (Cookie cookie : request.getCookies()) {
        if ("token".equals(cookie.getName())) {
          String token = cookie.getValue();
          // Return token even if it is "undefined" to let the validation fail later.
          return token;
        }
      }
    }

    return null;
  }
}
