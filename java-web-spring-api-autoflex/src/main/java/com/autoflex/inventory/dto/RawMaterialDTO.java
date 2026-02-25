package com.autoflex.inventory.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RawMaterialDTO {

    private Long id;
    private String name;
    private BigDecimal stockQuantity;
}
