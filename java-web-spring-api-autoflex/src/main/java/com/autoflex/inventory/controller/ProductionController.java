package com.autoflex.inventory.controller;

import com.autoflex.inventory.dto.ProductionDTO;
import com.autoflex.inventory.service.ProductionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/productions")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ProductionController {

    private final ProductionService service;

    @GetMapping
    public List<ProductionDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ProductionDTO findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public ProductionDTO create(@RequestBody @Valid ProductionDTO dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public ProductionDTO update(@PathVariable Long id,
                                @RequestBody @Valid ProductionDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
