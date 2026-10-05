package usecase;

import com.pa.proyecto.backend_integrator.core.exception.ResourceNotFoundException;
import com.pa.proyecto.backend_integrator.core.model.Project;
import com.pa.proyecto.backend_integrator.core.output.IProjectRepository;
import com.pa.proyecto.backend_integrator.core.usecase.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectQueriesUseCaseTest {
    @Mock IProjectRepository repository;

    @Test
    void returnsTheRequestedProject() {
        Project project = new Project();
        when(repository.findById(1L)).thenReturn(Optional.of(project));
        assertSame(project, new GetProjectByIdUseCase(repository).getProjectById(1L));
    }

    @Test
    void missingProjectIsNotFound() {
        when(repository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class,
                () -> new GetProjectByIdUseCase(repository).getProjectById(1L));
    }

    @Test
    void deletesAnExistingProject() {
        when(repository.findById(1L)).thenReturn(Optional.of(new Project()));
        new DeleteProjectUseCase(repository).deleteProject(1L);
        verify(repository).deleteById(1L);
    }

    @Test
    void neverDeletesAMissingProject() {
        when(repository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class,
                () -> new DeleteProjectUseCase(repository).deleteProject(1L));
        verify(repository, never()).deleteById(anyLong());
    }
}

