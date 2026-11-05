package com.example.studentservice.service.impl;

import com.example.studentservice.model.Student;
import com.example.studentservice.model.University;
import com.example.studentservice.repository.StudentRepository;
import com.example.studentservice.repository.UniversityRepository;
import com.example.studentservice.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final UniversityRepository universityRepository;

    public StudentServiceImpl(StudentRepository studentRepository, UniversityRepository universityRepository) {
        this.studentRepository = studentRepository;
        this.universityRepository = universityRepository;
    }

    @Override
    public Student saveStudent(Student student) {
        if (student.getName() == null || student.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The student name is required");
        }
        if (student.getUniversity() == null || student.getUniversity().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "university.id is required");
        }
        University university = universityRepository.findById(student.getUniversity().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "University not found"));

        student.setUniversity(university);
        return studentRepository.save(student);
    }

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
    @Override
public Student getStudentById(Long id) {
    return studentRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
}

@Override
public Student updateStudent(Long id, Student studentDetails) {
    Student existingStudent = getStudentById(id);
    existingStudent.setName(studentDetails.getName());
    existingStudent.setAddress(studentDetails.getAddress());

    if (studentDetails.getUniversity() != null && studentDetails.getUniversity().getId() != null) {
        University university = universityRepository.findById(studentDetails.getUniversity().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "University not found"));
        existingStudent.setUniversity(university);
    }

    return studentRepository.save(existingStudent);
}

@Override
public void deleteStudent(Long id) {
    studentRepository.deleteById(id);
}

}
