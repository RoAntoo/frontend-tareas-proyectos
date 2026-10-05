package com.pa.proyecto.backend_integrator.adapter.persistence;

import com.pa.proyecto.backend_integrator.adapter.persistence.entity.TaskEntity;
import com.pa.proyecto.backend_integrator.adapter.persistence.repository.ProjectJpaRepository;
import com.pa.proyecto.backend_integrator.adapter.persistence.repository.TaskJpaRepository;
import com.pa.proyecto.backend_integrator.core.exception.ResourceNotFoundException;
import com.pa.proyecto.backend_integrator.core.model.Task;
import com.pa.proyecto.backend_integrator.core.output.ITaskRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class TaskRepositoryAdapter implements ITaskRepository {
    private final TaskJpaRepository repository;
    private final ProjectJpaRepository projectRepository;

    public TaskRepositoryAdapter(TaskJpaRepository repository, ProjectJpaRepository projectRepository) {
        this.repository = repository;
        this.projectRepository = projectRepository;
    }

    @Override
    public Task save(Task task) {
        TaskEntity entity = task.getId() == null ? new TaskEntity()
                : repository.findByIdAndProjectId(task.getId(), task.getProject().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Task not found in project"));
        PersistenceMapper.copy(task, entity);
        if (entity.getProject() == null) {
            entity.setProject(projectRepository.getReferenceById(task.getProject().getId()));
        }
        return PersistenceMapper.toDomain(repository.saveAndFlush(entity));
    }

    @Override
    public Optional<Task> findByIdAndProjectId(Long id, Long projectId) {
        return repository.findByIdAndProjectId(id, projectId).map(PersistenceMapper::toDomain);
    }

    @Override
    public List<Task> findByProjectId(Long projectId) {
        return repository.findByProjectIdOrderByIdAsc(projectId).stream()
                .map(PersistenceMapper::toDomain).toList();
    }
}
