package com.easyshops.backend.service.adress;

import com.easyshops.backend.dto.AddressDto;
import com.easyshops.backend.exeptions.ResourceNotFoundException;
import com.easyshops.backend.model.Address;
import com.easyshops.backend.model.User;
import com.easyshops.backend.repository.AddressRepository;
import com.easyshops.backend.repository.UserRepository;
import com.easyshops.backend.request.CreateAddressRequest;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService implements IAddressService {
  private final AddressRepository addressRepository;
  private final UserRepository userRepository;
  private final ModelMapper modelMapper;

  @Override
  public Address createAddress(CreateAddressRequest request) {
    Address address = new Address();
    address.setStreet(request.getStreet());
    address.setCity(request.getCity());
    address.setCounty(request.getCounty());
    address.setCountry(request.getCountry());
    address.setZipCode(request.getZipCode());
    return addressRepository.save(address);
  }

  @Override
  public Address getAddressById(Long id) {
    return addressRepository.findById(id).orElseThrow(
            () -> new ResourceNotFoundException(
                    "Address not found with id: " + id));
  }

  @Override
  public Address updateAddress(Long id, CreateAddressRequest request) {
    Address existingAddress = getAddressById(id);
    existingAddress.setStreet(request.getStreet());
    existingAddress.setCity(request.getCity());
    existingAddress.setCounty(request.getCounty());
    existingAddress.setCountry(request.getCountry());
    existingAddress.setZipCode(request.getZipCode());
    return addressRepository.save(existingAddress);
  }

  @Override
  public void deleteAddress(Long id) {
    addressRepository.findById(id)
                     .ifPresentOrElse(addressRepository::delete, () -> {
                       throw new ResourceNotFoundException("Address not found");
                     });
  }

  @Override
  public Address createAddressForUser(Long userId, CreateAddressRequest request) {
    User user = userRepository.findById(userId).orElseThrow(
            () -> new ResourceNotFoundException(
                    "User not found with id: " + userId));

    Address address = new Address();
    address.setStreet(request.getStreet());
    address.setCity(request.getCity());
    address.setCounty(request.getCounty());
    address.setCountry(request.getCountry());
    address.setZipCode(request.getZipCode());
    address.setUser(user);

    user.getAddresses().add(address);
    return addressRepository.save(address);
  }

  @Override
  public List<AddressDto> getAddressesByUserId(Long userId) {
    List<Address> addresses = addressRepository.findByUserId(userId);
    return addresses.stream().map(this::convertAddressToDto).toList();
  }


  @Override
  public AddressDto convertAddressToDto(Address address) {
    return modelMapper.map(address, AddressDto.class);
  }
}

