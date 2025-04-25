package com.easyshops.backend.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "addresses")
public class Address {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String street;
  private String city;
  private String county;
  private String country;
  private String zipCode;

  @OneToMany(mappedBy = "address", cascade = CascadeType.ALL,
             orphanRemoval = true)
  private Set<Order> orders = new HashSet<>();

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

}

