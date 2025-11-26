package com.user.repository;

import com.user.entity.Marks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarksRepository extends JpaRepository<Marks, Long> {
    List<Marks> findByStudentId(Long studentId);
    List<Marks> findByStudentIdAndSemester(Long studentId, Integer semester);
    List<Marks> findBySemester(Integer semester);

    @Query("SELECT m.student.department, AVG(m.marksObtained) FROM Marks m GROUP BY m.student.department")
    List<Object[]> findAverageMarksByDepartment();
}
