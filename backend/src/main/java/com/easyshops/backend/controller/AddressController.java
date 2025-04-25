package com.easyshops.backend.controller;

import com.easyshops.backend.dto.AddressDto;
import com.easyshops.backend.exeptions.ResourceNotFoundException;
import com.easyshops.backend.model.Address;
import com.easyshops.backend.request.CreateAddressRequest;
import com.easyshops.backend.response.ApiResponse;
import com.easyshops.backend.service.adress.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/address")
public class AddressController {
  private final AddressService addressService;

  @GetMapping("/{addressId}/get")
  public ResponseEntity<ApiResponse> getAddressById(
          @PathVariable Long addressId) {
    try {
      Address address = addressService.getAddressById(addressId);
      AddressDto addressDto = addressService.convertAddressToDto(address);
      return ResponseEntity.ok(
              new ApiResponse("Success, address retrieved!", addressDto));
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(NOT_FOUND)
                           .body(new ApiResponse(e.getMessage(), null));
    }
  }

  @GetMapping("/user/{userId}")
  public ResponseEntity<ApiResponse> getAddressesByUserId(
          @PathVariable Long userId) {
    try {
      List<AddressDto> addresses = addressService.getAddressesByUserId(userId);
      return ResponseEntity.ok(new ApiResponse(
              "All addresses for this user retrieved successfully", addresses));
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(NOT_FOUND)
                           .body(new ApiResponse(e.getMessage(), null));
    }
  }

  @PostMapping("/user/{userId}/create")
  public ResponseEntity<ApiResponse> createAddressForUser(
          @PathVariable Long userId,
          @RequestBody CreateAddressRequest request) {
    try {
      Address address = addressService.createAddressForUser(userId, request);
      AddressDto addressDto = addressService.convertAddressToDto(address);
      return ResponseEntity.ok(
              new ApiResponse("Address created successfully!", addressDto));
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(NOT_FOUND)
                           .body(new ApiResponse(e.getMessage(), null));
    }
  }


  @PostMapping("/create")
  public ResponseEntity<ApiResponse> createAddress(
          @RequestBody CreateAddressRequest request) {
    try {
      Address address = addressService.createAddress(request);
      AddressDto addressDto = addressService.convertAddressToDto(address);
      return ResponseEntity.ok(
              new ApiResponse("Address created successfully!", addressDto));
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(CONFLICT)
                           .body(new ApiResponse(e.getMessage(), null));
    }
  }

  @PutMapping("/{addressId}/update")
  public ResponseEntity<ApiResponse> updateAddress(
          @PathVariable Long addressId,
          @RequestBody CreateAddressRequest request) {
    try {
      Address updatedAddress = addressService.updateAddress(addressId, request);
      AddressDto addressDto =
              addressService.convertAddressToDto(updatedAddress);
      return ResponseEntity.ok(
              new ApiResponse("Address updated successfully!", addressDto));
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(NOT_FOUND)
                           .body(new ApiResponse(e.getMessage(), null));
    }
  }

  @DeleteMapping("/{addressId}/delete")
  public ResponseEntity<ApiResponse> deleteAddress(
          @PathVariable Long addressId) {
    try {
      addressService.deleteAddress(addressId);
      return ResponseEntity.ok(
              new ApiResponse("Address deleted successfully!", null));
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(NOT_FOUND)
                           .body(new ApiResponse(e.getMessage(), null));
    }
  }
}
