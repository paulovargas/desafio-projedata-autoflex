package com.autoflex.inventory.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "productions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Production {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "line_name", nullable = false)
    private String lineName;

    @Column(name = "order_code", nullable = false)
    private String orderCode;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private Integer progress;
}
