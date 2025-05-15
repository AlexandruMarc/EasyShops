package com.easyshops.backend.security.config;

import com.easyshops.backend.security.jwt.AuthTokenFilter;
import com.easyshops.backend.security.jwt.JwtAuthEntryPoint;
import com.easyshops.backend.security.user.ShopUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;

@RequiredArgsConstructor
@EnableWebSecurity
@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class ShopConfig {
  private final ShopUserDetailsService userDetailsService;
  private final JwtAuthEntryPoint jwtAuthEntryPoint;
  private static final List<String> SECURED_URLS =
          List.of("/api/v1/cart/**");

  @Bean
  public ModelMapper modelMapper() {
    return new ModelMapper();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public AuthTokenFilter authTokenFilter() {
    return new AuthTokenFilter();
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws
          Exception {
    return authConfig.getAuthenticationManager();
  }

  /**
   * Configures the authentication provider to use a custom user details service and password encoder.
   */
  @Bean
  public DaoAuthenticationProvider daoAuthenticationProvider() {
    var authProvider = new DaoAuthenticationProvider();
    authProvider.setUserDetailsService(userDetailsService);
    authProvider.setPasswordEncoder(passwordEncoder());
    return authProvider;
  }

  /**
   * Configures the security filter chain, including CORS, CSRF, session management, and JWT authentication.
   */
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(AbstractHttpConfigurer::disable)
        .cors(cors -> cors.configurationSource(request -> {
          var corsConfiguration =
                  new org.springframework.web.cors.CorsConfiguration();
          corsConfiguration.setAllowedOrigins(List.of("http://localhost:5173"));
          corsConfiguration.setAllowedMethods(
                  List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
          corsConfiguration.setAllowedHeaders(List.of("*"));
          corsConfiguration.setAllowCredentials(true);
          return corsConfiguration;
        })).exceptionHandling(
                exception -> exception.authenticationEntryPoint(jwtAuthEntryPoint))
        .sessionManagement(session -> session.sessionCreationPolicy(
                SessionCreationPolicy.STATELESS)).authorizeHttpRequests(
                auth -> auth.requestMatchers(SECURED_URLS.toArray(String[]::new))
                            .authenticated().anyRequest().permitAll());
    http.authenticationProvider(daoAuthenticationProvider());
    http.addFilterBefore(authTokenFilter(),
            UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }
}