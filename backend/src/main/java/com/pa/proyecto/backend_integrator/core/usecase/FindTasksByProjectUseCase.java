package com.pa.proyecto.backend_integrator.core.usecase;

import com.pa.proyecto.backend_integrator.core.exception.ResourceNotFoundException;
import com.pa.proyecto.backend_integrator.core.input.IFindTasksByProjectInput;
import com.pa.proyecto.backend_integrator.core.model.Task;
import com.pa.proyecto.backend_integrator.core.output.IProjectRepository;
import com.pa.proyecto.backend_integrator.core.output.ITaskRepository;
import java.util.List;

public class FindTasksByProjectUseCase implements IFindTasksByProjectInput {
    private final IProjectRepository projectRepository;
    private final ITaskRepository taskRepository;

    public FindTasksByProjectUseCase(IProjectRepository projectRepository, ITaskRepository taskRepository) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
    }

    @Override
    public List<Task> findTasksByProject(Long projectId) {
        projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        return taskRepository.findByProjectId(projectId);
    }
}
