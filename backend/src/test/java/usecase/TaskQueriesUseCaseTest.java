package usecase;

import com.pa.proyecto.backend_integrator.core.exception.ResourceNotFoundException;
import com.pa.proyecto.backend_integrator.core.model.Project;
import com.pa.proyecto.backend_integrator.core.model.Task;
import com.pa.proyecto.backend_integrator.core.output.*;
import com.pa.proyecto.backend_integrator.core.usecase.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskQueriesUseCaseTest {
    @Mock IProjectRepository projects;
    @Mock ITaskRepository tasks;

    @Test
    void returnsOnlyTheTaskInTheRequestedProject() {
        Task task = new Task();
        when(tasks.findByIdAndProjectId(3L, 1L)).thenReturn(Optional.of(task));
        assertSame(task, new GetTaskByIdUseCase(tasks).getTaskById(1L, 3L));
    }

    @Test
    void foreignOrMissingTaskIsNotFound() {
        when(tasks.findByIdAndProjectId(3L, 2L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class,
                () -> new GetTaskByIdUseCase(tasks).getTaskById(2L, 3L));
    }

    @Test
    void existingProjectWithNoTasksReturnsAnEmptyList() {
        when(projects.findById(1L)).thenReturn(Optional.of(new Project()));
        when(tasks.findByProjectId(1L)).thenReturn(List.of());
        assertTrue(new FindTasksByProjectUseCase(projects, tasks).findTasksByProject(1L).isEmpty());
    }

    @Test
    void missingProjectIsNotAnEmptyTaskList() {
        when(projects.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class,
                () -> new FindTasksByProjectUseCase(projects, tasks).findTasksByProject(1L));
        verifyNoInteractions(tasks);
    }
}

