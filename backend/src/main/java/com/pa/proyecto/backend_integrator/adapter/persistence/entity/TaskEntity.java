package com.pa.proyecto.backend_integrator.adapter.persistence.entity;

import com.pa.proyecto.backend_integrator.core.model.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks", indexes = @Index(name = "idx_tasks_project_id", columnList = "project_id"))
@Getter
@Setter
public class TaskEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String title;
    private Integer estimateHours;
    private String assignee;
    @Enumerated(EnumType.STRING)
    private TaskStatus status;
    private LocalDateTime finishedAt;
    private LocalDateTime createdAt;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private ProjectEntity project;
}
