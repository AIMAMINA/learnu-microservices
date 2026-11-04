package com.example.studentservice.service.impl;

import com.example.studentservice.model.Student;
import com.example.studentservice.model.University;
import com.example.studentservice.repository.StudentRepository;
import com.example.studentservice.repository.UniversityRepository;
import com.example.studentservice.service.StudentService;
import org.springframework.stereotype.Service;
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
        University university = universityRepository.findById(student.getUniversity().getId())
                .orElseThrow(() -> new RuntimeException("Université non trouvée"));

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
            .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));
}

@Override
public Student updateStudent(Long id, Student studentDetails) {
    Student existingStudent = getStudentById(id);
    existingStudent.setName(studentDetails.getName());
    existingStudent.setAddress(studentDetails.getAddress());

    if (studentDetails.getUniversity() != null) {
        University university = universityRepository.findById(studentDetails.getUniversity().getId())
                .orElseThrow(() -> new RuntimeException("Université non trouvée"));
        existingStudent.setUniversity(university);
    }

    return studentRepository.save(existingStudent);
}

@Override
public void deleteStudent(Long id) {
    studentRepository.deleteById(id);
}

}
