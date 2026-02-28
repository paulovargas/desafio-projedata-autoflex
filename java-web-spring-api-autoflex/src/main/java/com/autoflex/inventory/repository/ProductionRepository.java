package com.autoflex.inventory.repository;

import com.autoflex.inventory.entity.Production;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductionRepository extends JpaRepository<Production, Long> {
}
