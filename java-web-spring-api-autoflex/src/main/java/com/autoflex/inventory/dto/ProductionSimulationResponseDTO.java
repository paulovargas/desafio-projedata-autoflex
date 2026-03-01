package com.autoflex.inventory.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Builder
public class ProductionSimulationResponseDTO {

    private List<ProductionResultDTO> items;
    private Integer totalProducibleQuantity;
    private BigDecimal totalValue;
}
