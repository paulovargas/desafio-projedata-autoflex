package com.autoflex.inventory.service;

import com.autoflex.inventory.dto.ProductRawMaterialDTO;
import com.autoflex.inventory.entity.Product;
import com.autoflex.inventory.entity.ProductRawMaterial;
import com.autoflex.inventory.entity.RawMaterial;
import com.autoflex.inventory.repository.ProductRawMaterialRepository;
import com.autoflex.inventory.repository.ProductRepository;
import com.autoflex.inventory.repository.RawMaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductRawMaterialService {

    private final ProductRawMaterialRepository repository;
    private final ProductRepository productRepository;
    private final RawMaterialRepository rawMaterialRepository;

    public ProductRawMaterialDTO create(ProductRawMaterialDTO dto) {

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        RawMaterial rawMaterial = rawMaterialRepository.findById(dto.getRawMaterialId())
                .orElseThrow(() -> new RuntimeException("Raw material not found"));

        ProductRawMaterial entity = ProductRawMaterial.builder()
                .product(product)
                .rawMaterial(rawMaterial)
                .requiredQuantity(dto.getRequiredQuantity())
                .build();

        ProductRawMaterial saved = repository.save(entity);

        return ProductRawMaterialDTO.builder()
                .id(saved.getId())
                .productId(product.getId())
                .rawMaterialId(rawMaterial.getId())
                .requiredQuantity(saved.getRequiredQuantity())
                .build();
    }

    public List<ProductRawMaterialDTO> findByProduct(Long productId) {
        return repository.findByProductId(productId)
                .stream()
                .map(entity -> ProductRawMaterialDTO.builder()
                        .id(entity.getId())
                        .productId(entity.getProduct().getId())
                        .rawMaterialId(entity.getRawMaterial().getId())
                        .requiredQuantity(entity.getRequiredQuantity())
                        .build())
                .collect(Collectors.toList());
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
