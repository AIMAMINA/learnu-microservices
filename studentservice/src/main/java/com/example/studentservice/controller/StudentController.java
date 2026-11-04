package com.example.studentservice.controller;

import com.example.studentservice.model.Student;
import com.example.studentservice.repository.StudentRepository;
import com.example.studentservice.service.StudentService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentRepository studentRepository;

    private final StudentService studentService;

    public StudentController(StudentService studentService, StudentRepository studentRepository) {
        this.studentService = studentService;
        this.studentRepository = studentRepository;
    }

    @PostMapping("/add")
    public Student addStudent(@RequestBody Student student) {
        return studentService.saveStudent(student);
    }

    @GetMapping("/all")
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }
    @GetMapping("/{id}")
public Student getStudentById(@PathVariable Long id) {
    return studentService.getStudentById(id);
}

@PutMapping("/update/{id}")
public Student updateStudent(@PathVariable Long id, @RequestBody Student student) {
    return studentService.updateStudent(id, student);
}

@DeleteMapping("/delete/{id}")
public void deleteStudent(@PathVariable Long id) {
    studentService.deleteStudent(id);
}
@GetMapping("/search")
public List<Student> searchByName(@RequestParam String name) {
    return studentRepository.findByNameContainingIgnoreCase(name);
}
@PostMapping("/bulk")
public ResponseEntity<List<Student>> addMany(@RequestBody List<Student> students) {
    return ResponseEntity.ok(studentRepository.saveAll(students));
}

}