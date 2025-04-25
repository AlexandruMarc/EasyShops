package com.easyshops.backend.service.image;

import com.easyshops.backend.dto.ImageDto;
import com.easyshops.backend.model.Image;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


public interface IImageService {
  Image getImageById(Long id);

  void deleteImageById(Long id);

  List<ImageDto> saveImages(List<MultipartFile> files, Long productId);

  ImageDto saveProfileImage(MultipartFile file, Long userId);

  void updateImage(MultipartFile file, Long imageId);
}
