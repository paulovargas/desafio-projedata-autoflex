package com.autoflex.inventory.mapper;

import com.autoflex.inventory.dto.ProductDTO;
import com.autoflex.inventory.entity.Product;
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public interface ProductMapper {

    ProductDTO toDTO(Product entity);

    Product toEntity(ProductDTO dto);
}