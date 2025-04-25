package com.easyshops.backend.dto;

import lombok.Data;

@Data
public class ImageDto {
  private Long imageId;
  private String imageName;
  private String downloadURL;
}
