package com.examly.springapp.controller;

import com.examly.springapp.model.Freelancer;
import com.examly.springapp.model.Project;
import com.examly.springapp.model.ProjectStatus;
import com.examly.springapp.service.ProjectService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProjectController.class)
public class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProjectService projectService;

    private Project project;
    private Freelancer john;

    @BeforeEach
    public void setup() {
        john = new Freelancer(1L, "John Doe", "john.doe@example.com", "Java, Spring Boot, React", 35.0, "Experienced full-stack developer with 3 years of experience", LocalDate.of(2023, 1, 15));
        project = new Project(1L, "E-commerce Website Development", "Develop a full-stack e-commerce website with product catalog and payment integration", 5000.0, LocalDate.of(2023, 12, 31), "ABC Company", ProjectStatus.OPEN, LocalDate.of(2023, 6, 1), null);
    }

    @Test
    public void controller_testGetProjectById_found() throws Exception {
        given(projectService.getProjectById(1L)).willReturn(project);
        mockMvc.perform(get("/api/projects/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("E-commerce Website Development"));
    }

    @Test
    public void controller_testGetProjectById_notFound() throws Exception {
        given(projectService.getProjectById(2L)).willThrow(new RuntimeException());
        mockMvc.perform(get("/api/projects/2"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Project not found with id: 2"));
    }

    @Test
    public void controller_testGetAllProjects() throws Exception {
        given(projectService.getAllProjects()).willReturn(List.of(project));
        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("E-commerce Website Development"));
    }

    @Test
    public void controller_testCreateProject_success() throws Exception {
        given(projectService.createProject(any(Project.class))).willReturn(project);
        String json = """
                {
                  "title": "E-commerce Website Development",
                  "description": "Develop a full-stack e-commerce website with product catalog and payment integration",
                  "budget": 5000.0,
                  "deadline": "2023-12-31",
                  "clientName": "ABC Company",
                  "status": "OPEN",
                  "createdDate": "2023-06-01"
                }
                """;
        mockMvc.perform(post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("E-commerce Website Development"));
    }

    @Test
    public void controller_testCreateProject_validationError() throws Exception {
        String json = """
                {
                  "title": "",
                  "description": "",
                  "budget": -200,
                  "deadline": "2021-01-01",
                  "clientName": "",
                  "status": "OPEN",
                  "createdDate": "2023-06-01"
                }
                """;
        mockMvc.perform(post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.errors").isArray());
    }

    @Test
    public void controller_testAssignFreelancerToProject_success() throws Exception {
        Project updatedProject = new Project(project.getId(), project.getTitle(), project.getDescription(), project.getBudget(), project.getDeadline(), project.getClientName(), ProjectStatus.IN_PROGRESS, project.getCreatedDate(), john);
        given(projectService.getProjectById(1L)).willReturn(project);
        given(projectService.assignFreelancerToProject(1L, 1L)).willReturn(updatedProject);
        mockMvc.perform(put("/api/projects/1/assign/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"))
                .andExpect(jsonPath("$.assignedFreelancer.id").value(1L));
    }

    @Test
    public void controller_testAssignFreelancerToProject_notOpenStatus() throws Exception {
        Project nonOpenProject = new Project(project.getId(), project.getTitle(), project.getDescription(), project.getBudget(), project.getDeadline(), project.getClientName(), ProjectStatus.COMPLETED, project.getCreatedDate(), null);
        given(projectService.getProjectById(1L)).willReturn(nonOpenProject);
        mockMvc.perform(put("/api/projects/1/assign/1"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Project is not in OPEN status"));
    }

    @Test
    public void controller_testAssignFreelancerToProject_notFound() throws Exception {
        given(projectService.getProjectById(2L)).willThrow(new RuntimeException());
        mockMvc.perform(put("/api/projects/2/assign/1"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    public void controller_testFindProjectsByStatus_success() throws Exception {
        Project inProgressProject = new Project(project.getId(), project.getTitle(), project.getDescription(), project.getBudget(), project.getDeadline(), project.getClientName(), ProjectStatus.IN_PROGRESS, project.getCreatedDate(), john);
        given(projectService.findProjectsByStatus(ProjectStatus.IN_PROGRESS)).willReturn(List.of(inProgressProject));
        mockMvc.perform(get("/api/projects/status/IN_PROGRESS"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("IN_PROGRESS"));
    }

    @Test
    public void controller_testFindProjectsByStatus_invalid() throws Exception {
        mockMvc.perform(get("/api/projects/status/invalidstatus"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid status. Valid values are: OPEN, IN_PROGRESS, COMPLETED"));
    }

    @Test
    public void controller_testFindProjectsByStatus_empty() throws Exception {
        given(projectService.findProjectsByStatus(ProjectStatus.COMPLETED)).willReturn(Collections.emptyList());
        mockMvc.perform(get("/api/projects/status/COMPLETED"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }
}
