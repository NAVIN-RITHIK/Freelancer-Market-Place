package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title cannot be empty")
    private String title;

    @NotBlank(message = "Description cannot be empty")
    @Column(length = 2000)
    private String description;

    @NotNull(message = "Budget is required")
    @Positive(message = "Budget must be positive")
    private Double budget;

    @NotNull(message = "Deadline is required")
    private LocalDate deadline;

    @NotBlank(message = "Client name cannot be empty")
    private String clientName;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    private ProjectStatus status;

    @NotNull(message = "Created date is required")
    private LocalDate createdDate;

    @ManyToOne
    @JoinColumn(name = "assigned_freelancer_id")
    private Freelancer assignedFreelancer;
}
