package com.pa.proyecto.backend_integrator.adapter.persistence;

import com.pa.proyecto.backend_integrator.adapter.persistence.entity.ProjectEntity;
import com.pa.proyecto.backend_integrator.adapter.persistence.entity.TaskEntity;
import com.pa.proyecto.backend_integrator.core.model.Project;
import com.pa.proyecto.backend_integrator.core.model.Task;
import com.pa.proyecto.backend_integrator.core.model.enums.TaskStatus;

final class PersistenceMapper {
    private PersistenceMapper() {}

    // Task collections have their own query port; project reads do not load them.
    static Project toDomain(ProjectEntity entity) {
        Project project = new Project();
        project.setId(entity.getId());
        project.setName(entity.getName());
        project.setStartDate(entity.getStartDate());
        project.setEndDate(entity.getEndDate());
        project.setStatus(entity.getStatus());
        project.setDescription(entity.getDescription());
        return project;
    }

    static Task toDomain(TaskEntity entity) {
        Task task = new Task();
        task.setId(entity.getId());
        task.setTitle(entity.getTitle());
        task.setEstimateHours(entity.getEstimateHours());
        task.setAssignee(entity.getAssignee());
        // Keep old database values readable while returning the frontend's DONE status.
        task.setStatus(entity.getStatus() == TaskStatus.COMPLETED ? TaskStatus.DONE : entity.getStatus());
        task.setFinishedAt(entity.getFinishedAt());
        task.setCreatedAt(entity.getCreatedAt());
        task.setProject(toDomain(entity.getProject()));
        return task;
    }

    static void copy(Project project, ProjectEntity entity) {
        entity.setName(project.getName());
        entity.setStartDate(project.getStartDate());
        entity.setEndDate(project.getEndDate());
        entity.setStatus(project.getStatus());
        entity.setDescription(project.getDescription());
    }

    static void copy(Task task, TaskEntity entity) {
        entity.setTitle(task.getTitle());
        entity.setEstimateHours(task.getEstimateHours());
        entity.setAssignee(task.getAssignee());
        entity.setStatus(task.getStatus());
        entity.setFinishedAt(task.getFinishedAt());
        entity.setCreatedAt(task.getCreatedAt());
    }
}
