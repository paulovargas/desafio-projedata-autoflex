package com.autoflex.inventory.service;

import com.autoflex.inventory.dto.ProductDTO;
import com.autoflex.inventory.dto.ProductionResultDTO;
import com.autoflex.inventory.entity.Product;
import com.autoflex.inventory.entity.ProductRawMaterial;
import com.autoflex.inventory.entity.RawMaterial;
import com.autoflex.inventory.mapper.ProductMapper;
import com.autoflex.inventory.repository.ProductRawMaterialRepository;
import com.autoflex.inventory.repository.ProductRepository;
import com.autoflex.inventory.repository.RawMaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductRawMaterialRepository productRawMaterialRepository;
    private final ProductMapper mapper;
    private final RawMaterialRepository rawMaterialRepository;

    public List<ProductDTO> findAll() {
        return productRepository.findAll()
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO findById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return mapper.toDTO(product);
    }

    public ProductDTO create(ProductDTO dto) {
        Product product = mapper.toEntity(dto);
        return mapper.toDTO(productRepository.save(product));
    }

    public ProductDTO update(Long id, ProductDTO dto) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        existing.setName(dto.getName());
        existing.setValue(dto.getValue());

        return mapper.toDTO(productRepository.save(existing));
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    public List<ProductionResultDTO> calculateProduction() {

        List<Product> products =
                productRepository.findAllByOrderByValueDesc();

        Map<Long, BigDecimal> stockMap =
                rawMaterialRepository.findAll()
                        .stream()
                        .collect(Collectors.toMap(
                                RawMaterial::getId,
                                RawMaterial::getStockQuantity
                        ));

        List<ProductionResultDTO> result = new ArrayList<>();

        for (Product product : products) {

            List<ProductRawMaterial> relations =
                    productRawMaterialRepository
                            .findByProductId(product.getId());

            int maxProduction = Integer.MAX_VALUE;

            for (ProductRawMaterial relation : relations) {

                BigDecimal available =
                        stockMap.get(relation.getRawMaterial().getId());

                BigDecimal required =
                        relation.getRequiredQuantity();

                int possible =
                        available.divide(required, RoundingMode.DOWN)
                                .intValue();

                maxProduction = Math.min(maxProduction, possible);
            }

            if (maxProduction > 0) {

                // desconta do estoque simulado
                for (ProductRawMaterial relation : relations) {

                    Long rawId = relation.getRawMaterial().getId();

                    BigDecimal used =
                            relation.getRequiredQuantity()
                                    .multiply(BigDecimal.valueOf(maxProduction));

                    stockMap.put(
                            rawId,
                            stockMap.get(rawId).subtract(used)
                    );
                }
            }

            result.add(
                    ProductionResultDTO.builder()
                            .productId(product.getId())
                            .productName(product.getName())
                            .producibleQuantity(maxProduction)
                            .build()
            );
        }

        return result;
    }
}