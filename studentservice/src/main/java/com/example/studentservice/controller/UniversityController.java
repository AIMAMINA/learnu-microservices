package com.example.studentservice.controller;

import com.example.studentservice.model.University;
import com.example.studentservice.service.UniversityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/universities")
public class UniversityController {

    private final UniversityService universityService;

    @Autowired
    public UniversityController(UniversityService universityService) {
        this.universityService = universityService;
    }

    @PostMapping("/add")
    public University addUniversity(@RequestBody University university) {
        return universityService.saveUniversity(university);
    }

@GetMapping("/all")
public List<University> getAllUniversities() {
    List<University> list = universityService.getAllUniversities();
    list.forEach(u -> u.setStudents(null)); // éviter les boucles
    return list;
}

    @GetMapping("/{id}")
    public University getUniversityById(@PathVariable Long id) {
        return universityService.getUniversityById(id);
    }

    @PutMapping("/update/{id}")
    public University updateUniversity(@PathVariable Long id, @RequestBody University university) {
        return universityService.updateUniversity(id, university);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteUniversity(@PathVariable Long id) {
        universityService.deleteUniversity(id);
    }

}