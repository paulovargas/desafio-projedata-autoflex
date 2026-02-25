package com.autoflex.inventory.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProductionResultDTO {

    private Long productId;
    private String productName;
    private Integer producibleQuantity;
}