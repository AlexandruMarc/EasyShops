package com.easyshops.backend.service.adress;

import com.easyshops.backend.dto.AddressDto;
import com.easyshops.backend.model.Address;
import com.easyshops.backend.request.CreateAddressRequest;

import java.util.List;

public interface IAddressService {
  Address createAddress(CreateAddressRequest request);

  Address getAddressById(Long id);

  Address updateAddress(Long id, CreateAddressRequest request);

  void deleteAddress(Long id);

  Address createAddressForUser(Long userId, CreateAddressRequest request);

  List<AddressDto> getAddressesByUserId(Long userId);

  AddressDto convertAddressToDto(Address address);
}
