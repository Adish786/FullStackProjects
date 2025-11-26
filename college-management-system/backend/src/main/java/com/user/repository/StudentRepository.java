package com.user.repository;

import com.user.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByRollNumber(String rollNumber);
    Boolean existsByRollNumber(String rollNumber);
    List<Student> findByDepartment(String department);
    List<Student> findByYear(Integer year);
    @Query("SELECT COUNT(s) FROM Student s")
    Long countTotalStudents();
    @Query("SELECT s.department, COUNT(s) FROM Student s GROUP BY s.department")
    List<Object[]> countStudentsByDepartment();
}
