package com.example.studentservice.repository;

import com.example.studentservice.model.University;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UniversityRepository extends JpaRepository<University, Long> {

    // ✅ Charge aussi la liste des étudiants (LEFT JOIN FETCH évite le lazy loading)
    @Query("SELECT DISTINCT u FROM University u LEFT JOIN FETCH u.students")
    List<University> findAllWithStudents();
}
