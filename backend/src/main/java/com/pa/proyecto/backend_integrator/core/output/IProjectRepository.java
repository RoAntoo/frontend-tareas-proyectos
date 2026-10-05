package com.pa.proyecto.backend_integrator.core.output;

import com.pa.proyecto.backend_integrator.core.input.DTO.FindProjectsQueryDTO;
import com.pa.proyecto.backend_integrator.core.model.Project;

import java.util.List;
import java.util.Optional;

public interface IProjectRepository {
    Project save(Project project);
    Optional<Project> findById(Long id);
    boolean existsByName(String name);
    List<Project> findWithFilters(FindProjectsQueryDTO query);
    /** Deletes the project and its tasks atomically in the application's transaction. */
    void deleteById(Long id);
}
