package com.pa.proyecto.backend_integrator.adapter.persistence.repository;

import com.pa.proyecto.backend_integrator.adapter.persistence.entity.ProjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProjectJpaRepository extends JpaRepository<ProjectEntity, Long>, JpaSpecificationExecutor<ProjectEntity> {
    boolean existsByName(String name);
}
