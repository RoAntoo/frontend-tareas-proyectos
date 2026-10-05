package com.pa.proyecto.backend_integrator.core.model;

import com.pa.proyecto.backend_integrator.core.model.enums.ProjectStatus;
import com.pa.proyecto.backend_integrator.core.model.enums.TaskStatus;

import java.time.LocalDateTime;
import java.util.Objects;
public class Task {
    private Long id;
    private String title;

    private Integer estimateHours;
    private String assignee;
    private TaskStatus status;

    private LocalDateTime finishedAt;
    private LocalDateTime createdAt;
    private Project project;
    private Task(Project project, String title, Integer estimateHours,
                 String assignee, TaskStatus status, LocalDateTime createdAt) {
        this.project = project;
        this.title = title;
        this.estimateHours = estimateHours;
        this.assignee = assignee;
        this.status = status;
        this.createdAt = createdAt;
        if (status == TaskStatus.DONE) {
            this.finishedAt = createdAt;
        }
    }

    public static Task create(Project project, String title, Integer estimateHours,
                              String assignee, TaskStatus status, LocalDateTime createdAtTimestamp) {

        if (project == null) {
            throw new IllegalArgumentException("Project is required");
        }
        if (status == null) {
            throw new IllegalArgumentException("Task status is required");
        }
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Task title is required");
        }
        if (estimateHours == null || estimateHours <= 0) {
            throw new IllegalArgumentException("Estimate hours must be greater than 0");
        }
        if (project.getStatus() == ProjectStatus.CLOSED) {
            throw new IllegalArgumentException("Cannot add a task to a CLOSED project");
        }

        TaskStatus normalizedStatus = status == TaskStatus.COMPLETED ? TaskStatus.DONE : status;
        return new Task(project, title, estimateHours, assignee, normalizedStatus, createdAtTimestamp);
    }

    public void setStatus(TaskStatus newStatus, LocalDateTime timestamp) {
        if (newStatus == null) throw new IllegalArgumentException("Task status is required");
        if (newStatus == TaskStatus.COMPLETED) newStatus = TaskStatus.DONE;
        if (newStatus == TaskStatus.DONE && this.status != TaskStatus.DONE) {
            this.finishedAt = timestamp;
        } else if (newStatus != TaskStatus.DONE) {
            this.finishedAt = null;
        }
        this.status = newStatus;
    }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Task task = (Task) o;
        return id != null && Objects.equals(id, task.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    public Task() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Integer getEstimateHours() { return estimateHours; }
    public void setEstimateHours(Integer estimateHours) { this.estimateHours = estimateHours; }

    public String getAssignee() { return assignee; }
    public void setAssignee(String assignee) { this.assignee = assignee; }

    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }

    public LocalDateTime getFinishedAt() { return finishedAt; }
    public void setFinishedAt(LocalDateTime finishedAt) { this.finishedAt = finishedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
}
