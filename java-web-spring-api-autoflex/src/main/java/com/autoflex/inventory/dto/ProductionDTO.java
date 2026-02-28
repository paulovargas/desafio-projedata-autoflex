package com.autoflex.inventory.dto;

import lombok.*;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductionDTO {

    private Long id;

    @NotBlank
    private String line;

    @NotBlank
    private String orderCode;

    @NotBlank
    private String status;

    @NotNull
    @Min(0)
    @Max(100)
    private Integer progress;
}
