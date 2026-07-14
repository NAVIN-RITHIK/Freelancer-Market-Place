package com.examly.springapp.repository;

import com.examly.springapp.model.Project;
import com.examly.springapp.model.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStatus(ProjectStatus status);
    List<Project> findByBudgetGreaterThanEqual(Double budget);
    List<Project> findByClientName(String clientName);
}
