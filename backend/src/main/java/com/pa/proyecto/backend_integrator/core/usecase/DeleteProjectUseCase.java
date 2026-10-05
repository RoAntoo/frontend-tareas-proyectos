package com.pa.proyecto.backend_integrator.core.usecase;

import com.pa.proyecto.backend_integrator.core.exception.ResourceNotFoundException;
import com.pa.proyecto.backend_integrator.core.input.IDeleteProjectInput;
import com.pa.proyecto.backend_integrator.core.output.IProjectRepository;

public class DeleteProjectUseCase implements IDeleteProjectInput {
    private final IProjectRepository projectRepository;

    public DeleteProjectUseCase(IProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Override
    public void deleteProject(Long projectId) {
        projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        projectRepository.deleteById(projectId);
    }
}
