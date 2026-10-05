package com.pa.proyecto.backend_integrator.adapter.web;

import com.pa.proyecto.backend_integrator.adapter.web.service.ProjectApplicationService;
import com.pa.proyecto.backend_integrator.core.input.DTO.*;
import com.pa.proyecto.backend_integrator.core.model.enums.ProjectStatus;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/projects")
public class ProjectController {
    private final ProjectApplicationService service;

    public ProjectController(ProjectApplicationService service) {
        this.service = service;
    }

    @GetMapping
    public List<ProjectResponseDTO> findProjects(
            @RequestParam(required = false) ProjectStatus status,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        return service.findProjects(new FindProjectsQueryDTO(Optional.ofNullable(status),
                Optional.ofNullable(startDate), Optional.ofNullable(endDate)));
    }

    @GetMapping("/{projectId}")
    public ProjectResponseDTO getProject(@PathVariable Long projectId) {
        return service.getProject(projectId);
    }

    @PostMapping
    public ResponseEntity<ProjectResponseDTO> createProject(@RequestBody CreateProjectDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createProject(dto));
    }

    @PutMapping("/{projectId}")
    public ProjectResponseDTO updateProject(@PathVariable Long projectId, @RequestBody UpdateProjectDTO dto) {
        return service.updateProject(projectId, dto);
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long projectId) {
        service.deleteProject(projectId);
        return ResponseEntity.noContent().build();
    }
}