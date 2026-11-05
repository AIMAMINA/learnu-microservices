package com.example.activityservice.controller;

import com.example.activityservice.model.UserActivity;
import com.example.activityservice.repository.UserActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/activity")
@RequiredArgsConstructor
public class UserActivityController {

    private final UserActivityRepository repository;

    // Ajouter une activité
    @PostMapping("/add")
    public UserActivity addActivity(@RequestBody UserActivity activity) {
        activity.setTimestamp(LocalDateTime.now());
        return repository.save(activity);
    }

    // Obtenir les 10 dernières activités
    @GetMapping("/latest")
    public List<UserActivity> getLatest() {
        return repository.findTop10ByOrderByTimestampDesc();
    }

    // Supprimer toutes les activités
    @DeleteMapping("/clear")
    public ResponseEntity<String> clearAllLogs() {
        repository.deleteAll();
        return ResponseEntity.ok("✅ All audit logs deleted successfully.");
    }
}
