package com.pa.proyecto.backend_integrator.adapter.web.service;

import com.pa.proyecto.backend_integrator.adapter.web.mapper.ResponseMapper;
import com.pa.proyecto.backend_integrator.core.input.*;
import com.pa.proyecto.backend_integrator.core.input.DTO.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class TaskApplicationService {
    private final ITaskCreateInput create;
    private final IUpdateTaskInput update;
    private final IGetTaskByIdInput getById;
    private final IFindTasksByProjectInput findByProject;

    public TaskApplicationService(ITaskCreateInput create, IUpdateTaskInput update,
            IGetTaskByIdInput getById, IFindTasksByProjectInput findByProject) {
        this.create = create;
        this.update = update;
        this.getById = getById;
        this.findByProject = findByProject;
    }

    public List<TaskResponseDTO> findTasks(Long projectId) {
        return findByProject.findTasksByProject(projectId).stream().map(ResponseMapper::toResponse).toList();
    }

    public TaskResponseDTO getTask(Long projectId, Long taskId) {
        return ResponseMapper.toResponse(getById.getTaskById(projectId, taskId));
    }

    @Transactional
    public TaskResponseDTO createTask(Long projectId, CreateTaskDTO dto) {
        return ResponseMapper.toResponse(create.createTask(projectId, dto));
    }

    @Transactional
    public TaskResponseDTO updateTask(Long projectId, Long taskId, UpdateTaskDTO dto) {
        return ResponseMapper.toResponse(update.updateTask(projectId, taskId, dto));
    }
}
