package com.easyshops.backend.controller;

import com.easyshops.backend.dto.ImageDto;
import com.easyshops.backend.exeptions.ResourceNotFoundException;
import com.easyshops.backend.model.Image;
import com.easyshops.backend.response.ApiResponse;
import com.easyshops.backend.service.image.IImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.sql.SQLException;
import java.util.List;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/images")
public class ImageController {
  private final IImageService imageService;

  @PostMapping("/upload")
  public ResponseEntity<ApiResponse> saveImages(
          @RequestParam List<MultipartFile> files,
          @RequestParam Long productId) {
    try {
      if (productId == null) {
        throw new ResourceNotFoundException("Product ID is required.");
      }
      List<ImageDto> imageDtos = imageService.saveImages(files, productId);
      return ResponseEntity.ok(new ApiResponse("Upload Success!", imageDtos));
    } catch (Exception e) {
      return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                           .body(new ApiResponse("Upload failed!",
                                   e.getMessage()));
    }
  }

  @PostMapping("/user/upload")
  public ResponseEntity<ApiResponse> saveImageProfile(
          @RequestParam MultipartFile file, @RequestParam Long userId) {
    try {
      ImageDto imageDtos = imageService.saveProfileImage(file, userId);
      return ResponseEntity.ok(new ApiResponse("Upload Success!", imageDtos));
    } catch (Exception e) {
      return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                           .body(new ApiResponse("Upload failed!",
                                   e.getMessage()));
    }
  }

  @GetMapping("/image/download/{imageId}")
  @Transactional
  public ResponseEntity<Resource> downloadImage(
          @PathVariable Long imageId) throws SQLException {
    Image image = imageService.getImageById(imageId);
    ByteArrayResource resource = new ByteArrayResource(
            image.getImage().getBytes(1, (int) image.getImage().length()));
    return ResponseEntity.ok().contentType(
                                 MediaType.parseMediaType(image.getFileType()))
                         .header(HttpHeaders.CONTENT_DISPOSITION,
                                 "attachment: filename=\"" +
                                 image.getFileName() + "\"").body(resource);
  }

  @PutMapping("/image/{imageId}/update")
  public ResponseEntity<ApiResponse> updateImage(
          @PathVariable Long imageId, @RequestParam MultipartFile file) {
    try {
      Image image = imageService.getImageById(imageId);
      if (image != null) {
        imageService.updateImage(file, imageId);
        Image updatedImage = imageService.getImageById(imageId);
        ImageDto imageDto = new ImageDto();
        imageDto.setImageId(updatedImage.getId());
        imageDto.setImageName(updatedImage.getFileName());
        imageDto.setDownloadURL(updatedImage.getDownloadUrl());
        return ResponseEntity.ok(new ApiResponse("Update success!", imageDto));
      }
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(NOT_FOUND)
                           .body(new ApiResponse(e.getMessage(), null));
    }
    return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                         .body(new ApiResponse("Update Failed!",
                                 INTERNAL_SERVER_ERROR));
  }

  @DeleteMapping("/image/{imageId}/delete")
  public ResponseEntity<ApiResponse> deleteImage(@PathVariable Long imageId) {
    try {
      Image image = imageService.getImageById(imageId);
      if (image != null) {
        imageService.deleteImageById(imageId);
        return ResponseEntity.ok(new ApiResponse("Delete success!", null));
      }
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.status(NOT_FOUND)
                           .body(new ApiResponse(e.getMessage(), null));
    }
    return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                         .body(new ApiResponse("Delete Failed!",
                                 INTERNAL_SERVER_ERROR));
  }
}
