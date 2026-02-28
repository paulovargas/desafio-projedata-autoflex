package com.autoflex.inventory.mapper;

import com.autoflex.inventory.dto.ProductionDTO;
import com.autoflex.inventory.entity.Production;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductionMapper {

    @Mapping(target = "line", source = "lineName")
    ProductionDTO toDTO(Production entity);

    @Mapping(target = "lineName", source = "line")
    Production toEntity(ProductionDTO dto);
}
