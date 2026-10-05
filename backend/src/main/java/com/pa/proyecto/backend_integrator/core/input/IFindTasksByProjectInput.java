package com.pa.proyecto.backend_integrator.core.input;

import com.pa.proyecto.backend_integrator.core.model.Task;
import java.util.List;

public interface IFindTasksByProjectInput {
    List<Task> findTasksByProject(Long projectId);
}
