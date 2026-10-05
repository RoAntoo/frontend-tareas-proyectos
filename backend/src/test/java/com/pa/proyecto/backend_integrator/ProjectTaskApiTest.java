package com.pa.proyecto.backend_integrator;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.pa.proyecto.backend_integrator.adapter.persistence.repository.ProjectJpaRepository;
import com.pa.proyecto.backend_integrator.adapter.persistence.repository.TaskJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = "spring.datasource.url=jdbc:h2:mem:api-tests;DB_CLOSE_DELAY=-1")
@AutoConfigureMockMvc
@Import(ProjectTaskApiTest.FixedClockConfig.class)
class ProjectTaskApiTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired ProjectJpaRepository projects;
    @Autowired TaskJpaRepository tasks;
    @Autowired JdbcTemplate jdbc;

    @TestConfiguration
    static class FixedClockConfig {
        @Bean
        @Primary
        Clock testClock() {
            return Clock.fixed(Instant.parse("2026-10-04T15:00:00Z"), ZoneId.of("America/Argentina/Buenos_Aires"));
        }
    }

    @BeforeEach
    void cleanTestDatabase() {
        jdbc.execute("DROP TABLE IF EXISTS task_locks");
        tasks.deleteAll();
        projects.deleteAll();
    }

    @Test
    void projectCrudMatchesTheFrontendAndDeletesItsTasks() throws Exception {
        long projectId = createProject("Nivi", "ACTIVE");
        long taskId = createTask(projectId, "TODO");
        mvc.perform(get("/projects")).andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(projectId));
        mvc.perform(get("/projects/{id}", projectId)).andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Nivi"));
        mvc.perform(put("/projects/{id}", projectId).contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Nivi editado\",\"startDate\":\"2026-10-05\",\"endDate\":\"2026-11-05\",\"description\":\"Nueva descripción\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.name").value("Nivi editado"))
                .andExpect(jsonPath("$.status").value("ACTIVE"));
        mvc.perform(delete("/projects/{id}", projectId)).andExpect(status().isNoContent())
                .andExpect(content().string(""));
        assertFalse(projects.existsById(projectId));
        assertFalse(tasks.existsById(taskId));
        mvc.perform(get("/projects/{id}", projectId)).andExpect(status().isNotFound());
    }

    @Test
    void taskCrudMatchesTheFrontendAndCanClearTheAssignee() throws Exception {
        long projectId = createProject("Tareas", "ACTIVE");
        long taskId = createTask(projectId, "TODO");
        mvc.perform(get("/projects/{id}/tasks", projectId)).andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(taskId)).andExpect(jsonPath("$[0].projectId").value(projectId));
        mvc.perform(get("/projects/{id}/tasks/{taskId}", projectId, taskId)).andExpect(status().isOk())
                .andExpect(jsonPath("$.estimateHours").value(4)).andExpect(jsonPath("$.assignee").value("Ro"));
        mvc.perform(put("/projects/{id}/tasks/{taskId}", projectId, taskId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"Tarea editada\",\"estimateHours\":8,\"assignee\":null}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.title").value("Tarea editada"))
                .andExpect(jsonPath("$.estimateHours").value(8)).andExpect(jsonPath("$.assignee").doesNotExist())
                .andExpect(jsonPath("$.status").value("TODO"));
        mvc.perform(get("/projects/{id}/tasks/{taskId}", projectId, taskId)).andExpect(status().isOk())
                .andExpect(jsonPath("$.assignee").doesNotExist());
    }

    @Test
    void foreignTaskCannotBeReadOrEditedAndOtherProjectsSurviveDeletion() throws Exception {
        long owner = createProject("Dueño", "ACTIVE");
        long other = createProject("Otro", "ACTIVE");
        long taskId = createTask(owner, "TODO");
        long otherTask = createTask(other, "TODO");
        mvc.perform(get("/projects/{id}/tasks/{taskId}", other, taskId)).andExpect(status().isNotFound());
        mvc.perform(put("/projects/{id}/tasks/{taskId}", other, taskId)
                .contentType(MediaType.APPLICATION_JSON).content("{\"title\":\"No permitido\"}"))
                .andExpect(status().isNotFound());
        mvc.perform(get("/projects/{id}/tasks", other)).andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1)).andExpect(jsonPath("$[0].id").value(otherTask));
        mvc.perform(delete("/projects/{id}", owner)).andExpect(status().isNoContent());
        assertTrue(projects.existsById(other));
        assertTrue(tasks.existsById(otherTask));
    }

    @Test
    void missingResourcesReturnTheSharedErrorContract() throws Exception {
        mvc.perform(get("/projects/999999")).andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Not Found")).andExpect(jsonPath("$.message").isString());
        mvc.perform(delete("/projects/999999")).andExpect(status().isNotFound());
        mvc.perform(get("/projects/999999/tasks")).andExpect(status().isNotFound());
        mvc.perform(get("/projects/999999/tasks/999999")).andExpect(status().isNotFound());
        mvc.perform(post("/projects/999999/tasks").contentType(MediaType.APPLICATION_JSON)
                .content(taskBody("TODO").toString())).andExpect(status().isNotFound());
    }

    @Test
    void projectWithoutTasksReturnsAnEmptyArray() throws Exception {
        long id = createProject("Vacío", "PLANNED");
        mvc.perform(get("/projects/{id}/tasks", id)).andExpect(status().isOk()).andExpect(content().json("[]"));
    }

    @Test
    void duplicateNamesReturnConflictWithoutChangingData() throws Exception {
        createProject("Duplicado", "ACTIVE");
        long second = createProject("Original", "ACTIVE");
        mvc.perform(post("/projects").contentType(MediaType.APPLICATION_JSON)
                .content(projectBody("Duplicado", "ACTIVE").toString())).andExpect(status().isConflict());
        mvc.perform(put("/projects/{id}", second).contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Duplicado\"}")).andExpect(status().isConflict());
        assertEquals("Original", projects.findById(second).orElseThrow().getName());
        assertEquals(2, projects.count());
    }

    @Test
    void invalidProjectUpdateRollsBackAllChanges() throws Exception {
        long id = createProject("Sin cambios", "ACTIVE");
        mvc.perform(put("/projects/{id}", id).contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"No guardar\",\"endDate\":\"2026-01-01\"}"))
                .andExpect(status().isConflict());
        assertEquals("Sin cambios", projects.findById(id).orElseThrow().getName());
        mvc.perform(put("/projects/{id}", id).contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Tampoco guardar\",\"startDate\":\"2026-01-01\",\"endDate\":\"2026-02-01\"}"))
                .andExpect(status().isConflict());
        assertEquals("Sin cambios", projects.findById(id).orElseThrow().getName());
    }

    @Test
    void failedCascadeDeletionRollsBackTheProjectAndEveryTask() throws Exception {
        long id = createProject("Borrado atómico", "ACTIVE");
        long first = createTask(id, "TODO");
        long locked = createTask(id, "TODO");
        jdbc.execute("CREATE TABLE task_locks (task_id BIGINT REFERENCES tasks(id))");
        jdbc.update("INSERT INTO task_locks (task_id) VALUES (?)", locked);
        mvc.perform(delete("/projects/{id}", id)).andExpect(status().isConflict());
        assertTrue(projects.existsById(id));
        assertTrue(tasks.existsById(first));
        assertTrue(tasks.existsById(locked));
        jdbc.execute("DROP TABLE task_locks");
    }

    @Test
    void invalidTaskUpdateDoesNotPersistItsTitle() throws Exception {
        long id = createProject("Validaciones", "ACTIVE");
        long taskId = createTask(id, "TODO");
        mvc.perform(put("/projects/{id}/tasks/{taskId}", id, taskId).contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"No guardar\",\"estimateHours\":0}"))
                .andExpect(status().isConflict());
        assertEquals("Tarea", tasks.findById(taskId).orElseThrow().getTitle());
        mvc.perform(put("/projects/{id}/tasks/{taskId}", id, taskId).contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"   \"}")).andExpect(status().isBadRequest());
    }

    @Test
    void closedProjectRejectsNewTasks() throws Exception {
        long id = createProject("Cerrado", "CLOSED");
        mvc.perform(post("/projects/{id}/tasks", id).contentType(MediaType.APPLICATION_JSON)
                .content(taskBody("TODO").toString())).andExpect(status().isConflict());
        assertEquals(0, tasks.count());
    }

    @Test
    void completedTasksHaveDeterministicTimestamps() throws Exception {
        long id = createProject("Finalizado", "ACTIVE");
        long taskId = createTask(id, "DONE");
        mvc.perform(get("/projects/{id}/tasks/{taskId}", id, taskId)).andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DONE"))
                .andExpect(jsonPath("$.createdAt").value("2026-10-04T12:00:00"))
                .andExpect(jsonPath("$.finishedAt").value("2026-10-04T12:00:00"));
    }

    @Test
    void projectFiltersUseDateOverlapAndStatus() throws Exception {
        createProject("Activo", "ACTIVE");
        createProject("Planeado", "PLANNED");
        mvc.perform(get("/projects").param("status", "ACTIVE").param("startDate", "2026-10-20")
                .param("endDate", "2026-10-25")).andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1)).andExpect(jsonPath("$[0].name").value("Activo"));
        mvc.perform(get("/projects").param("startDate", "2027-01-01")).andExpect(status().isOk())
                .andExpect(content().json("[]"));
        mvc.perform(get("/projects").param("startDate", "2026-10-20").param("endDate", "2026-10-01"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void malformedInputReturnsStructuredBadRequest() throws Exception {
        mvc.perform(post("/projects").contentType(MediaType.APPLICATION_JSON).content("{"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.message").isString());
        mvc.perform(get("/projects/not-a-number")).andExpect(status().isBadRequest());
        mvc.perform(get("/projects").param("status", "UNKNOWN")).andExpect(status().isBadRequest());
        mvc.perform(post("/projects").contentType(MediaType.APPLICATION_JSON)
                .content(projectBody("Sin estado", "ACTIVE").putNull("status").toString()))
                .andExpect(status().isBadRequest());
        long id = createProject("Estado tarea", "ACTIVE");
        mvc.perform(post("/projects/{id}/tasks", id).contentType(MediaType.APPLICATION_JSON)
                .content(taskBody("TODO").putNull("status").toString())).andExpect(status().isBadRequest());
    }

    @Test
    void corsAllowsConfiguredWebAndNativeOriginsAndRejectsOthers() throws Exception {
        for (String origin : new String[]{"http://localhost:4200", "http://localhost:8100", "http://localhost",
                "https://localhost", "capacitor://localhost"}) {
            mvc.perform(options("/projects/1").with(request -> { request.setServerPort(8081); return request; })
                    .header("Origin", origin)
                    .header("Access-Control-Request-Method", "DELETE")
                    .header("Access-Control-Request-Headers", "Content-Type"))
                    .andExpect(status().isOk()).andExpect(header().string("Access-Control-Allow-Origin", origin));
        }
        mvc.perform(options("/projects").header("Origin", "https://unconfigured.example")
                .header("Access-Control-Request-Method", "GET")).andExpect(status().isForbidden());
    }

    private ObjectNode projectBody(String name, String status) {
        return json.createObjectNode().putNull("id").put("name", name).put("startDate", "2026-10-04")
                .put("endDate", "2026-11-04").put("status", status).put("description", "Descripción");
    }

    private ObjectNode taskBody(String status) {
        return json.createObjectNode().putNull("id").put("title", "Tarea").put("estimateHours", 4)
                .put("assignee", "Ro").put("status", status);
    }

    private long createProject(String name, String status) throws Exception {
        String response = mvc.perform(post("/projects").contentType(MediaType.APPLICATION_JSON)
                .content(projectBody(name, status).toString())).andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return json.readTree(response).get("id").asLong();
    }

    private long createTask(long projectId, String status) throws Exception {
        String response = mvc.perform(post("/projects/{id}/tasks", projectId).contentType(MediaType.APPLICATION_JSON)
                .content(taskBody(status).toString())).andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return json.readTree(response).get("id").asLong();
    }
}
