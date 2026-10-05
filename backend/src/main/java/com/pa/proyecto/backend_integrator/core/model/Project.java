package com.pa.proyecto.backend_integrator.core.model;

import com.pa.proyecto.backend_integrator.core.model.enums.ProjectStatus;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
public class Project {
    private Long id;
    private String name;

    private LocalDate startDate;
    private LocalDate endDate;
    private ProjectStatus status;

    private String description;
    private List<Task> tasks = new ArrayList<>();
    private Project(String name, LocalDate startDate, LocalDate endDate,
                    ProjectStatus status, String description) {
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.description = description;
    }
    public static Project create(String name, LocalDate startDate, LocalDate endDate,
                                 ProjectStatus status, String description,
                                 LocalDate today) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Project name is required");
        }
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Project start and end dates are required");
        }
        if (status == null) {
            throw new IllegalArgumentException("Project status is required");
        }
        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date must be after start date");
        }
        if (endDate.isBefore(today)) {
            throw new IllegalArgumentException("End date must be today or later");
        }

        return new Project(name, startDate, endDate, status, description);
    }

    public void addTask(Task task) {
        tasks.add(task);
        task.setProject(this);
    }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Project project = (Project) o;
        return id != null && Objects.equals(id, project.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    public Project() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public ProjectStatus getStatus() { return status; }
    public void setStatus(ProjectStatus status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<Task> getTasks() { return tasks; }
    public void setTasks(List<Task> tasks) { this.tasks = tasks; }
}
