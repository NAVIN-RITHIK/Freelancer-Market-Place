package com.examly.springapp.controller;

import com.examly.springapp.model.Freelancer;
import com.examly.springapp.service.FreelancerService;
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

@WebMvcTest(FreelancerController.class)
public class FreelancerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FreelancerService freelancerService;

    private Freelancer john;

    @BeforeEach
    public void setup() {
        john = new Freelancer(1L, "John Doe", "john.doe@example.com", "Java, Spring Boot, React", 35.0, "Experienced full-stack developer with 3 years of experience", LocalDate.of(2023, 1, 15));
    }

    @Test
    public void controller_testGetFreelancerById_found() throws Exception {
        given(freelancerService.getFreelancerById(1L)).willReturn(john);

        mockMvc.perform(get("/api/freelancers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("John Doe"));
    }

    @Test
    public void controller_testGetFreelancerById_notFound() throws Exception {
        given(freelancerService.getFreelancerById(2L)).willThrow(new RuntimeException());

        mockMvc.perform(get("/api/freelancers/2"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Freelancer not found with id: 2"));
    }

    @Test
    public void controller_testGetAllFreelancers() throws Exception {
        given(freelancerService.getAllFreelancers()).willReturn(List.of(john));

        mockMvc.perform(get("/api/freelancers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L));
    }

    @Test
    public void controller_testCreateFreelancer_success() throws Exception {
        given(freelancerService.createFreelancer(any(Freelancer.class))).willReturn(john);

        String json = """
                {
                  "name": "John Doe",
                  "email": "john.doe@example.com",
                  "skills": "Java, Spring Boot, React",
                  "hourlyRate": 35.0,
                  "bio": "Experienced full-stack developer with 3 years of experience",
                  "joinedDate": "2023-01-15"
                }
                """;

        mockMvc.perform(post("/api/freelancers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("John Doe"));
    }

    @Test
    public void controller_testCreateFreelancer_validationError() throws Exception {
        String json = """
                {
                  "name": "",
                  "email": "notanemail",
                  "skills": "",
                  "hourlyRate": 0,
                  "joinedDate": "2023-01-15"
                }
                """;
        mockMvc.perform(post("/api/freelancers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.errors").isArray());
    }

    @Test
    public void controller_testFindFreelancersBySkill() throws Exception {
        given(freelancerService.findFreelancersBySkill("React")).willReturn(List.of(john));

        mockMvc.perform(get("/api/freelancers/skill/React"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("John Doe"));
    }

    @Test
    public void controller_testFindFreelancersBySkill_empty() throws Exception {
        given(freelancerService.findFreelancersBySkill("Angular")).willReturn(Collections.emptyList());

        mockMvc.perform(get("/api/freelancers/skill/Angular"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }
}
