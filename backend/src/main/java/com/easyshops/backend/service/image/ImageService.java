package com.easyshops.backend.service.image;

import com.easyshops.backend.dto.ImageDto;
import com.easyshops.backend.exeptions.ResourceNotFoundException;
import com.easyshops.backend.model.Image;
import com.easyshops.backend.model.Product;
import com.easyshops.backend.model.User;
import com.easyshops.backend.repository.ImageRepository;
import com.easyshops.backend.repository.UserRepository;
import com.easyshops.backend.service.product.IProductService;
import com.easyshops.backend.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ImageService implements IImageService {
  private final ImageRepository imageRepository;
  private final IProductService productService;
  private final UserService userService;
  private final UserRepository userRepository;

  @Override
  public Image getImageById(Long id) {
    return imageRepository.findById(id).orElseThrow(
            () -> new ResourceNotFoundException(
                    "No image found with this id: " + id));
  }

  @Override
  public void deleteImageById(Long id) {
    imageRepository.findById(id)
                   .ifPresentOrElse(imageRepository::delete, () -> {
                     throw new ResourceNotFoundException(
                             "Image not found with this id: " + id);
                   });
  }

  @Override
  public List<ImageDto> saveImages(List<MultipartFile> files, Long productId) {
    Product product = productService.getProductById(productId);
    List<ImageDto> savedImageDto = new ArrayList<>();
    for (MultipartFile file : files) {
      try {
        Image image = new Image();
        image.setFileName(file.getOriginalFilename());
        image.setFileType(file.getContentType());
        image.setImage(new SerialBlob(file.getBytes()));
        image.setProduct(product);

        // This gets the image id and sets it to the url
        String buildDownloadUrl = "/api/v1/images/image/download/";
        String downloadUrl = buildDownloadUrl + image.getId();
        image.setDownloadUrl(downloadUrl);
        Image savedImage = imageRepository.save(image);

        savedImage.setDownloadUrl(buildDownloadUrl + savedImage.getId());
        imageRepository.save(savedImage);

        ImageDto imageDto = new ImageDto();
        imageDto.setImageId(savedImage.getId());
        imageDto.setImageName(savedImage.getFileName());
        imageDto.setDownloadURL(savedImage.getDownloadUrl());
        savedImageDto.add(imageDto);
      } catch (IOException | SQLException e) {
        throw new RuntimeException(e.getMessage());
      }
    }
    return savedImageDto;
  }

  @Override
  public ImageDto saveProfileImage(MultipartFile file, Long userId) {
    User user = userService.getUserById(userId);

    try {
      Image image = new Image();
      image.setFileName(file.getOriginalFilename());
      image.setFileType(file.getContentType());
      image.setImage(new SerialBlob(file.getBytes()));

      image = imageRepository.save(image);

      String buildDownloadUrl = "/api/v1/images/image/download/";
      image.setDownloadUrl(buildDownloadUrl + image.getId());
      imageRepository.save(image);

      user.setProfileImage(image);
      userRepository.save(user);

      ImageDto imageDto = new ImageDto();
      imageDto.setImageId(image.getId());
      imageDto.setImageName(image.getFileName());
      imageDto.setDownloadURL(image.getDownloadUrl());

      return imageDto;
    } catch (IOException | SQLException e) {
      throw new RuntimeException(e.getMessage());
    }
  }


  @Override
  public void updateImage(MultipartFile file, Long imageId) {
    Image image = getImageById(imageId);
    try {
      image.setFileName(file.getOriginalFilename());
      image.setFileName(file.getOriginalFilename());
      image.setImage(new SerialBlob(file.getBytes()));
      imageRepository.save(image);
    } catch (Exception e) {
      throw new RuntimeException(e.getMessage());
    }
  }
}
