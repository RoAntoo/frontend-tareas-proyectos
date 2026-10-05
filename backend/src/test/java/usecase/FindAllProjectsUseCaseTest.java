package usecase;

import com.pa.proyecto.backend_integrator.core.input.DTO.FindProjectsQueryDTO;
import com.pa.proyecto.backend_integrator.core.model.Project;
import com.pa.proyecto.backend_integrator.core.model.enums.ProjectStatus;
import com.pa.proyecto.backend_integrator.core.output.IProjectRepository;
import com.pa.proyecto.backend_integrator.core.usecase.FindAllProjectsUseCase;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FindAllProjectsUseCaseTest {
    @Mock IProjectRepository repository;
    @InjectMocks FindAllProjectsUseCase useCase;

    @Test
    void passesFiltersToThePersistencePort() {
        var query = new FindProjectsQueryDTO(Optional.of(ProjectStatus.ACTIVE), Optional.empty(), Optional.empty());
        var projects = List.of(new Project());
        when(repository.findWithFilters(query)).thenReturn(projects);
        assertEquals(projects, useCase.findAllProjects(query));
    }

    @Test
    void returnsAnEmptyListWhenNothingMatches() {
        var query = FindProjectsQueryDTO.empty();
        when(repository.findWithFilters(query)).thenReturn(List.of());
        assertTrue(useCase.findAllProjects(query).isEmpty());
    }

    @Test
    void rejectsAnInvertedDateRangeBeforeQuerying() {
        var query = new FindProjectsQueryDTO(Optional.empty(),
                Optional.of(LocalDate.of(2026, 10, 10)), Optional.of(LocalDate.of(2026, 10, 1)));
        assertThrows(IllegalArgumentException.class, () -> useCase.findAllProjects(query));
        verifyNoInteractions(repository);
    }
}

