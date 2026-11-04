package com.example.activityservice.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_activity")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;       // Qui a fait l’action
    private String action;         // Type d’action (Login, Add, Delete…)
    private String microservice;   // Nom du service (student, course, auth…)

    @Column(columnDefinition = "TEXT")
    private String details;        // Détails spécifiques : ID, nom, etc.

    private LocalDateTime timestamp; // Date et heure
}
