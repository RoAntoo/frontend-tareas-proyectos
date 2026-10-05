package com.pa.proyecto.backend_integrator.adapter.persistence;

import com.pa.proyecto.backend_integrator.adapter.persistence.entity.ProjectEntity;
import com.pa.proyecto.backend_integrator.adapter.persistence.repository.ProjectJpaRepository;
import com.pa.proyecto.backend_integrator.core.exception.ResourceNotFoundException;
import com.pa.proyecto.backend_integrator.core.input.DTO.FindProjectsQueryDTO;
import com.pa.proyecto.backend_integrator.core.model.Project;
import com.pa.proyecto.backend_integrator.core.output.IProjectRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class ProjectRepositoryAdapter implements IProjectRepository {
    private final ProjectJpaRepository repository;
    private final ProjectSpecification specification;

    public ProjectRepositoryAdapter(ProjectJpaRepository repository, ProjectSpecification specification) {
        this.repository = repository;
        this.specification = specification;
    }

    @Override
    public Project save(Project project) {
        ProjectEntity entity = project.getId() == null ? new ProjectEntity()
                : repository.findById(project.getId()).orElseThrow(() ->
                    new ResourceNotFoundException("Project not found with id: " + project.getId()));
        PersistenceMapper.copy(project, entity);
        return PersistenceMapper.toDomain(repository.saveAndFlush(entity));
    }

    @Override
    public Optional<Project> findById(Long id) {
        return repository.findById(id).map(PersistenceMapper::toDomain);
    }

    @Override
    public boolean existsByName(String name) {
        return repository.existsByName(name);
    }

    @Override
    public List<Project> findWithFilters(FindProjectsQueryDTO query) {
        return repository.findAll(specification.build(query), Sort.by("id")).stream()
                .map(PersistenceMapper::toDomain).toList();
    }

    @Override
    public void deleteById(Long id) {
        // Entity deletion triggers JPA cascades inside the application's transaction.
        repository.deleteById(id);
        repository.flush();
    }
}
