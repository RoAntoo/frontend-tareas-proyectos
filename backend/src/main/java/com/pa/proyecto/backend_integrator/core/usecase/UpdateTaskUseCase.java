package com.pa.proyecto.backend_integrator.core.usecase;

import com.pa.proyecto.backend_integrator.core.exception.ResourceNotFoundException;
import com.pa.proyecto.backend_integrator.core.exception.BusinessRuleViolationException;
import com.pa.proyecto.backend_integrator.core.input.IUpdateTaskInput;
import com.pa.proyecto.backend_integrator.core.input.DTO.UpdateTaskDTO;
import com.pa.proyecto.backend_integrator.core.model.Task;
import com.pa.proyecto.backend_integrator.core.output.ITaskRepository;

public class UpdateTaskUseCase implements IUpdateTaskInput {

    private final ITaskRepository taskRepository;
    public UpdateTaskUseCase(ITaskRepository taskRepository){
        this.taskRepository = taskRepository;
    }

    @Override
    public Task updateTask(Long projectId, Long taskId, UpdateTaskDTO dto) {
        Task existingTask = taskRepository.findByIdAndProjectId(taskId, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found in project: " + projectId));

        if (dto.title() != null && dto.title().isBlank()) {
            throw new IllegalArgumentException("Task title must not be blank");
        }
        if (dto.estimateHours() != null && dto.estimateHours() <= 0) {
            throw new BusinessRuleViolationException("Estimate hours must be greater than 0");
        }

        if (dto.title() != null) existingTask.setTitle(dto.title().trim());
        if (dto.estimateHours() != null) existingTask.setEstimateHours(dto.estimateHours());
        // The frontend sends null when the user clears the assignee field.
        existingTask.setAssignee(dto.assignee());

        return taskRepository.save(existingTask);
    }
}
