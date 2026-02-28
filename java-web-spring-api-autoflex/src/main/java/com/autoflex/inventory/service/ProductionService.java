package com.autoflex.inventory.service;

import com.autoflex.inventory.dto.ProductionDTO;
import com.autoflex.inventory.entity.Production;
import com.autoflex.inventory.mapper.ProductionMapper;
import com.autoflex.inventory.repository.ProductionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductionService {

    private final ProductionRepository repository;
    private final ProductionMapper mapper;

    public List<ProductionDTO> findAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    public ProductionDTO findById(Long id) {
        Production entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Production not found"));
        return mapper.toDTO(entity);
    }

    public ProductionDTO create(ProductionDTO dto) {
        Production entity = mapper.toEntity(dto);
        return mapper.toDTO(repository.save(entity));
    }

    public ProductionDTO update(Long id, ProductionDTO dto) {
        Production existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Production not found"));

        existing.setLineName(dto.getLine());
        existing.setOrderCode(dto.getOrderCode());
        existing.setStatus(dto.getStatus());
        existing.setProgress(dto.getProgress());

        return mapper.toDTO(repository.save(existing));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
