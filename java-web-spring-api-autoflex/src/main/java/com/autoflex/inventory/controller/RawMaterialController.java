package com.autoflex.inventory.controller;

import com.autoflex.inventory.dto.RawMaterialDTO;
import com.autoflex.inventory.service.RawMaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/raw-materials")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class RawMaterialController {

    private final RawMaterialService service;

    @PostMapping
    public RawMaterialDTO create(@RequestBody RawMaterialDTO dto) {
        System.out.println("RawMaterialDTO : " + dto.toString());
        return service.create(dto);
    }

    @GetMapping
    public List<RawMaterialDTO> findAll() {
        return service.findAll();
    }
}
