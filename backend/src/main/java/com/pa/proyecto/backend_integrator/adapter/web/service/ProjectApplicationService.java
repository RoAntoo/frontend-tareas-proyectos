package com.pa.proyecto.backend_integrator.adapter.web.service;

import com.pa.proyecto.backend_integrator.adapter.web.mapper.ResponseMapper;
import com.pa.proyecto.backend_integrator.core.input.*;
import com.pa.proyecto.backend_integrator.core.input.DTO.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/** Transaction and response boundary; business rules remain in the core use cases. */
@Service
@Transactional(readOnly = true)
public class ProjectApplicationService {
    private final ICreateProjectInput create;
    private final IUpdateProjectInput update;
    private final IFindAllProjectsInput findAll;
    private final IGetProjectByIdInput getById;
    private final IDeleteProjectInput delete;

    public ProjectApplicationService(ICreateProjectInput create, IUpdateProjectInput update,
            IFindAllProjectsInput findAll, IGetProjectByIdInput getById, IDeleteProjectInput delete) {
        this.create = create;
        this.update = update;
        this.findAll = findAll;
        this.getById = getById;
        this.delete = delete;
    }

    public List<ProjectResponseDTO> findProjects(FindProjectsQueryDTO query) {
        return findAll.findAllProjects(query).stream().map(ResponseMapper::toResponse).toList();
    }

    public ProjectResponseDTO getProject(Long projectId) {
        return ResponseMapper.toResponse(getById.getProjectById(projectId));
    }

    @Transactional
    public ProjectResponseDTO createProject(CreateProjectDTO dto) {
        return ResponseMapper.toResponse(create.createProject(dto));
    }

    @Transactional
    public ProjectResponseDTO updateProject(Long projectId, UpdateProjectDTO dto) {
        return ResponseMapper.toResponse(update.updateProject(projectId, dto));
    }

    @Transactional
    public void deleteProject(Long projectId) {
        delete.deleteProject(projectId);
    }
}
