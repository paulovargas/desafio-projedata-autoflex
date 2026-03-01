package com.autoflex.inventory.service;

import com.autoflex.inventory.dto.RawMaterialDTO;
import com.autoflex.inventory.entity.RawMaterial;
import com.autoflex.inventory.mapper.RawMaterialMapper;
import com.autoflex.inventory.repository.RawMaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RawMaterialService {

    private final RawMaterialRepository repository;
    private final RawMaterialMapper mapper;

    public List<RawMaterialDTO> findAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    public RawMaterialDTO findById(Long id) {
        RawMaterial entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Raw material not found"));
        return mapper.toDTO(entity);
    }

    public RawMaterialDTO create(RawMaterialDTO dto) {
        RawMaterial entity = mapper.toEntity(dto);
        return mapper.toDTO(repository.save(entity));
    }

    public RawMaterialDTO update(Long id, RawMaterialDTO dto) {
        RawMaterial existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Raw material not found"));

        existing.setName(dto.getName());
        existing.setStockQuantity(dto.getStockQuantity());

        return mapper.toDTO(repository.save(existing));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
