package com.pa.proyecto.backend_integrator.adapter.web;

import com.pa.proyecto.backend_integrator.adapter.web.service.TaskApplicationService;
import com.pa.proyecto.backend_integrator.core.input.DTO.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/projects/{projectId}/tasks")
public class TaskController {
    private final TaskApplicationService service;

    public TaskController(TaskApplicationService service) {
        this.service = service;
    }

    @GetMapping
    public List<TaskResponseDTO> findTasks(@PathVariable Long projectId) {
        return service.findTasks(projectId);
    }

    @GetMapping("/{taskId}")
    public TaskResponseDTO getTask(@PathVariable Long projectId, @PathVariable Long taskId) {
        return service.getTask(projectId, taskId);
    }

    @PostMapping
    public ResponseEntity<TaskResponseDTO> createTask(@PathVariable Long projectId, @RequestBody CreateTaskDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createTask(projectId, dto));
    }

    @PutMapping("/{taskId}")
    public TaskResponseDTO updateTask(@PathVariable Long projectId, @PathVariable Long taskId,
            @RequestBody UpdateTaskDTO dto) {
        return service.updateTask(projectId, taskId, dto);
    }
}