package com.autoflex.inventory.mapper;

import com.autoflex.inventory.dto.RawMaterialDTO;
import com.autoflex.inventory.entity.RawMaterial;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RawMaterialMapper {

    RawMaterialDTO toDTO(RawMaterial entity);

    RawMaterial toEntity(RawMaterialDTO dto);
}
