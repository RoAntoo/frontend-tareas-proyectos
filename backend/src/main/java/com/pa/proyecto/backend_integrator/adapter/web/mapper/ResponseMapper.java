package com.pa.proyecto.backend_integrator.adapter.web.mapper;

import com.pa.proyecto.backend_integrator.core.input.DTO.ProjectResponseDTO;
import com.pa.proyecto.backend_integrator.core.input.DTO.TaskResponseDTO;
import com.pa.proyecto.backend_integrator.core.model.Project;
import com.pa.proyecto.backend_integrator.core.model.Task;

public final class ResponseMapper {
    private ResponseMapper() {}

    public static ProjectResponseDTO toResponse(Project project) {
        return new ProjectResponseDTO(project.getId(), project.getName(), project.getStartDate(),
                project.getEndDate(), project.getStatus(), project.getDescription());
    }

    public static TaskResponseDTO toResponse(Task task) {
        return new TaskResponseDTO(task.getId(), task.getTitle(), task.getEstimateHours(),
                task.getAssignee(), task.getStatus(), task.getFinishedAt(),
                task.getCreatedAt(), task.getProject().getId());
    }
}
