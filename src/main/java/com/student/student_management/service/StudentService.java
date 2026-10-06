
package com.student.student_management.service;

import com.student.student_management.model.Student;
import com.student.student_management.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // Create student
    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }

    // Get all students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Get student by ID
    public Optional<Student> getStudentById(String id) {
        return studentRepository.findById(id);
    }

    // Update student
    public Optional<Student> updateStudent(
            String id, Student updatedStudent) {

        return studentRepository.findById(id)
                .map(existingStudent -> {
                    existingStudent.setFirstName(
                            updatedStudent.getFirstName());
                    existingStudent.setLastName(
                            updatedStudent.getLastName());
                    existingStudent.setDateOfBirth(
                            updatedStudent.getDateOfBirth());
                    existingStudent.setEmail(
                            updatedStudent.getEmail());
                    existingStudent.setPhoneNumber(
                            updatedStudent.getPhoneNumber());
                    existingStudent.setAddress(
                            updatedStudent.getAddress());
                    existingStudent.setEnrollmentDate(
                            updatedStudent.getEnrollmentDate());
                    existingStudent.setMajor(
                            updatedStudent.getMajor());

                    return studentRepository.save(existingStudent);
                });
    }

    // Delete student
    public boolean deleteStudent(String id) {
        if (!studentRepository.existsById(id)) {
            return false;
        }

        studentRepository.deleteById(id);
        return true;
    }
}