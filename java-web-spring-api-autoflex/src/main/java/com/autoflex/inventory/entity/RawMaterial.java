package com.autoflex.inventory.entity;

import lombok.*;
import javax.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "raw_materials")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RawMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal stockQuantity;

    @OneToMany(mappedBy = "rawMaterial")
    private List<ProductRawMaterial> products;
}
