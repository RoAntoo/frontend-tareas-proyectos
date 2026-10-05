package com.pa.proyecto.backend_integrator.adapter.persistence.repository;

import com.pa.proyecto.backend_integrator.adapter.persistence.entity.TaskEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TaskJpaRepository extends JpaRepository<TaskEntity, Long> {
    @EntityGraph(attributePaths = "project")
    Optional<TaskEntity> findByIdAndProjectId(Long id, Long projectId);

    @EntityGraph(attributePaths = "project")
    List<TaskEntity> findByProjectIdOrderByIdAsc(Long projectId);
}
