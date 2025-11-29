package com.user.controller;

import com.user.dto.MarksRequestDTO;
import com.user.entity.Marks;
import com.user.entity.Student;
import com.user.repository.StudentRepository;
import com.user.service.MarksService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/marks")
@Tag(name = "Marks Management", description = "APIs for managing student marks")
public class MarksController {

    private final MarksService marksService;
    private final StudentRepository studentRepository;

    public MarksController(MarksService marksService, StudentRepository studentRepository) {
        this.marksService = marksService;
        this.studentRepository = studentRepository;
    }

    @Operation(summary = "Add marks", description = "Create new marks entry")
    @ApiResponse(responseCode = "200", description = "Marks created successfully")
    @PostMapping
    public ResponseEntity<Marks> addMarks(@RequestBody MarksRequestDTO dto) {

        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Marks marks = new Marks();
        marks.setStudent(student);
        marks.setSubject(dto.getSubject());
        marks.setMarksObtained(dto.getMarksObtained());
        marks.setMaxMarks(dto.getMaxMarks());
        marks.setSemester(dto.getSemester());

        return ResponseEntity.ok(marksService.addMarks(marks));
    }

    @Operation(summary = "Update marks by ID")
    @PutMapping("/{id}")
    public ResponseEntity<Marks> update(@PathVariable Long id, @RequestBody MarksRequestDTO dto) {

        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Marks marks = new Marks();
        marks.setStudent(student);
        marks.setSubject(dto.getSubject());
        marks.setMarksObtained(dto.getMarksObtained());
        marks.setMaxMarks(dto.getMaxMarks());
        marks.setSemester(dto.getSemester());

        return ResponseEntity.ok(marksService.updateMarks(id, marks));
    }

    @Operation(summary = "Get marks by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Marks> getById(@PathVariable Long id) {
        return ResponseEntity.ok(marksService.getMarksById(id));
    }

    @Operation(summary = "Get marks by student ID")
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Marks>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(marksService.getMarksByStudent(studentId));
    }

    @Operation(summary = "Get all marks")
    @GetMapping
    public ResponseEntity<List<Marks>> getAll() {
        return ResponseEntity.ok(marksService.getAllMarks());
    }

    @Operation(summary = "Delete marks by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        marksService.deleteMarks(id);
        return ResponseEntity.ok("Marks deleted successfully");
    }
}

