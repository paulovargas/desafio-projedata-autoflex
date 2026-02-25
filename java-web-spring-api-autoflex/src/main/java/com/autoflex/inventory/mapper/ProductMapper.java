package com.autoflex.inventory.dto;

import com.autoflex.inventory.entity.Product;


@Mapper(componentModel = "spring")
public interface ProductMapper {

    ProductDTO toDTO(Product entity);

    Product toEntity(ProductDTO dto);
}