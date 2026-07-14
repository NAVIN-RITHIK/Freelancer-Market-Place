package com.examly.springapp.service;

import com.examly.springapp.model.Freelancer;
import com.examly.springapp.repository.FreelancerRepository;
import com.examly.springapp.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FreelancerService {
    private final FreelancerRepository freelancerRepository;

    @Autowired
    public FreelancerService(FreelancerRepository freelancerRepository) {
        this.freelancerRepository = freelancerRepository;
    }

    public List<Freelancer> getAllFreelancers() {
        return freelancerRepository.findAll();
    }

    public Freelancer getFreelancerById(Long id) {
        return freelancerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Freelancer not found with id: " + id));
    }

    public Freelancer createFreelancer(Freelancer freelancer) {
        return freelancerRepository.save(freelancer);
    }

    public List<Freelancer> findFreelancersBySkill(String skill) {
        return freelancerRepository.findBySkill(skill);
    }

    public List<Freelancer> findFreelancersByHourlyRateLessThanEqual(Double rate) {
        return freelancerRepository.findByHourlyRateLessThanEqual(rate);
    }
}
