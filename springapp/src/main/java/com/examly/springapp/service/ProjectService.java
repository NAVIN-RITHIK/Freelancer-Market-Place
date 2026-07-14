package com.examly.springapp.service;

import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.Freelancer;
import com.examly.springapp.model.Project;
import com.examly.springapp.model.ProjectStatus;
import com.examly.springapp.repository.FreelancerRepository;
import com.examly.springapp.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final FreelancerRepository freelancerRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository, FreelancerRepository freelancerRepository) {
        this.projectRepository = projectRepository;
        this.freelancerRepository = freelancerRepository;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    @Transactional
    public Project assignFreelancerToProject(Long projectId, Long freelancerId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        Freelancer freelancer = freelancerRepository.findById(freelancerId)
                .orElseThrow(() -> new ResourceNotFoundException("Freelancer not found with id: " + freelancerId));

        project.setAssignedFreelancer(freelancer);
        project.setStatus(ProjectStatus.IN_PROGRESS);
        return projectRepository.save(project);
    }

    public List<Project> findProjectsByStatus(ProjectStatus status) {
        return projectRepository.findByStatus(status);
    }

    public List<Project> findProjectsByBudgetGreaterThanEqual(Double budget) {
        return projectRepository.findByBudgetGreaterThanEqual(budget);
    }

    public List<Project> findProjectsByClientName(String clientName) {
        return projectRepository.findByClientName(clientName);
    }
}
