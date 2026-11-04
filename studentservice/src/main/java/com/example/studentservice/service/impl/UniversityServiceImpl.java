package com.example.studentservice.service.impl;

import com.example.studentservice.model.University;
import com.example.studentservice.repository.UniversityRepository;
import com.example.studentservice.service.UniversityService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UniversityServiceImpl implements UniversityService {

    private final UniversityRepository universityRepository;

    public UniversityServiceImpl(UniversityRepository universityRepository) {
        this.universityRepository = universityRepository;
    }

    @Override
    public University saveUniversity(University university) {
        return universityRepository.save(university);
    }

    @Override
    public List<University> getAllUniversities() {
        // ✅ Charger universités + étudiants
        List<University> universities = universityRepository.findAllWithStudents();

        // ✅ Calculer studentsCount pour chaque université
        for (University u : universities) {
            if (u.getStudents() != null) {
                u.setStudentsCount(u.getStudents().size());
            } else {
                u.setStudentsCount(0);
            }
        }

        return universities;
    }

    @Override
    public University getUniversityById(Long id) {
        University university = universityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Université non trouvée"));

        // ✅ Ajout du count ici aussi pour cohérence
        if (university.getStudents() != null) {
            university.setStudentsCount(university.getStudents().size());
        } else {
            university.setStudentsCount(0);
        }

        return university;
    }

    @Override
    public University updateUniversity(Long id, University updated) {
        University university = getUniversityById(id);
        university.setName(updated.getName());
        university.setCity(updated.getCity());
        return universityRepository.save(university);
    }

    @Override
    public void deleteUniversity(Long id) {
        universityRepository.deleteById(id);
    }
}
