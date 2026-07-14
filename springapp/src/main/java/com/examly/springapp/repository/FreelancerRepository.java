package com.examly.springapp.repository;

import com.examly.springapp.model.Freelancer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface FreelancerRepository extends JpaRepository<Freelancer, Long> {
    // Find freelancers by skill (matches any skill in comma-separated list - case-insensitive)
    @Query("SELECT f FROM Freelancer f WHERE LOWER(f.skills) LIKE CONCAT('%', LOWER(:skill), '%')")
    List<Freelancer> findBySkill(@Param("skill") String skill);

    List<Freelancer> findByHourlyRateLessThanEqual(Double hourlyRate);
}
