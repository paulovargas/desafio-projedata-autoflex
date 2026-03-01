package com.autoflex.inventory.controller;

import com.autoflex.inventory.dto.ProductRawMaterialDTO;
import com.autoflex.inventory.service.ProductRawMaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-raw-materials")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ProductRawMaterialController {

    private final ProductRawMaterialService service;

    @PostMapping
    public ProductRawMaterialDTO create(@RequestBody ProductRawMaterialDTO dto) {
        return service.create(dto);
    }

    @GetMapping("/{id}")
    public ProductRawMaterialDTO findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("/product/{productId}")
    public List<ProductRawMaterialDTO> findByProduct(@PathVariable Long productId) {
        return service.findByProduct(productId);
    }

    @PutMapping("/{id}")
    public ProductRawMaterialDTO update(@PathVariable Long id,
                                        @RequestBody ProductRawMaterialDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
