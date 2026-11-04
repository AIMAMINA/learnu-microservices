package com.example.studentservice.service;

import com.example.studentservice.model.University;
import java.util.List;

public interface UniversityService {
    University saveUniversity(University university);
    List<University> getAllUniversities();
    University getUniversityById(Long id);
    University updateUniversity(Long id, University university);
    void deleteUniversity(Long id);

}
