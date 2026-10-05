package com.pa.proyecto.backend_integrator.core.output;

import com.pa.proyecto.backend_integrator.core.model.Task;

import java.util.List;
import java.util.Optional;

public interface ITaskRepository {
    Task save(Task task);
    Optional<Task> findByIdAndProjectId(Long id, Long projectId);
    List<Task> findByProjectId(Long projectId);
}
