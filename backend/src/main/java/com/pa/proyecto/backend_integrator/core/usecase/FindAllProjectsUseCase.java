package com.pa.proyecto.backend_integrator.core.usecase;

import com.pa.proyecto.backend_integrator.core.input.IFindAllProjectsInput;
import com.pa.proyecto.backend_integrator.core.input.DTO.FindProjectsQueryDTO;
import com.pa.proyecto.backend_integrator.core.model.Project;
import com.pa.proyecto.backend_integrator.core.output.IProjectRepository;

import java.util.List;

public class FindAllProjectsUseCase implements IFindAllProjectsInput {

    private final IProjectRepository projectRepository;

    public FindAllProjectsUseCase(IProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Override
    public List<Project> findAllProjects(FindProjectsQueryDTO queryDTO) {
        if (queryDTO.startDate().isPresent() && queryDTO.endDate().isPresent()
                && queryDTO.endDate().get().isBefore(queryDTO.startDate().get())) {
            throw new IllegalArgumentException("Filter end date must be on or after start date");
        }
        return projectRepository.findWithFilters(queryDTO);
    }
}
