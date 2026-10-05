package com.pa.proyecto.backend_integrator.core.usecase;

import com.pa.proyecto.backend_integrator.core.exception.ResourceNotFoundException;
import com.pa.proyecto.backend_integrator.core.input.IGetTaskByIdInput;
import com.pa.proyecto.backend_integrator.core.model.Task;
import com.pa.proyecto.backend_integrator.core.output.ITaskRepository;

public class GetTaskByIdUseCase implements IGetTaskByIdInput {
    private final ITaskRepository taskRepository;

    public GetTaskByIdUseCase(ITaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public Task getTaskById(Long projectId, Long taskId) {
        return taskRepository.findByIdAndProjectId(taskId, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found in project: " + projectId));
    }
}
