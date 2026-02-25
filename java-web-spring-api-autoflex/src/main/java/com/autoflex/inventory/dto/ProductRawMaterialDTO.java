package com.autoflex.inventory.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductRawMaterialDTO {

    private Long id;
    private Long productId;
    private Long rawMaterialId;
    private BigDecimal requiredQuantity;
}
