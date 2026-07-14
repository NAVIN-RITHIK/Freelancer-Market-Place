package com.examly.springapp.controller;

import com.examly.springapp.model.Freelancer;
import com.examly.springapp.service.FreelancerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/freelancers")
public class FreelancerController {
    private final FreelancerService freelancerService;

    @Autowired
    public FreelancerController(FreelancerService freelancerService) {
        this.freelancerService = freelancerService;
    }

    @GetMapping
    public List<Freelancer> getAllFreelancers() {
        return freelancerService.getAllFreelancers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFreelancerById(@PathVariable Long id) {
        try {
            Freelancer freelancer = freelancerService.getFreelancerById(id);
            return ResponseEntity.ok(freelancer);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Freelancer not found with id: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @PostMapping
    public ResponseEntity<?> createFreelancer(@Valid @RequestBody Freelancer freelancer, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Validation failed");
            error.put("errors", result.getFieldErrors().stream().map(f -> f.getDefaultMessage()).collect(Collectors.toList()));
            return ResponseEntity.badRequest().body(error);
        }
        if (freelancer.getHourlyRate() == null || freelancer.getHourlyRate() <= 0) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Validation failed");
            error.put("errors", List.of("Hourly rate must be positive"));
            return ResponseEntity.badRequest().body(error);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(freelancerService.createFreelancer(freelancer));
    }

    @GetMapping("/skill/{skill}")
    public ResponseEntity<List<Freelancer>> findFreelancersBySkill(@PathVariable String skill) {
        return ResponseEntity.ok(freelancerService.findFreelancersBySkill(skill));
    }
}
