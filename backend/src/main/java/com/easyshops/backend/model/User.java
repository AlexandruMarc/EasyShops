package com.easyshops.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.NaturalId;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String firstName;
  private String lastName;

  @NaturalId
  private String email;
  private String password;

  @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  private Cart cart;

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  @OrderBy("orderDate DESC, orderId DESC")
  private List<Order> orders;

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Address> addresses;

  @ManyToMany(fetch = FetchType.EAGER,
              cascade = { CascadeType.DETACH, CascadeType.MERGE,
                      CascadeType.PERSIST, CascadeType.REFRESH })
  @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id",
                                                            referencedColumnName = "id"),
             inverseJoinColumns = @JoinColumn(name = "role_id",
                                              referencedColumnName = "id"))
  private Collection<Role> roles = new HashSet<>();

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "profile_image_id")
  private Image profileImage;
}
