package com.autoflex.inventory.service;

import com.autoflex.inventory.dto.ProductDTO;
import com.autoflex.inventory.entity.Product;
import com.autoflex.inventory.mapper.ProductMapper;
import com.autoflex.inventory.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository repository;
    private final ProductMapper mapper;

    public List<ProductDTO> findAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO findById(Long id) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return mapper.toDTO(product);
    }

    public ProductDTO create(ProductDTO dto) {
        Product product = mapper.toEntity(dto);
        return mapper.toDTO(repository.save(product));
    }

    public ProductDTO update(Long id, ProductDTO dto) {
        Product existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        existing.setName(dto.getName());
        existing.setValue(dto.getValue());

        return mapper.toDTO(repository.save(existing));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}