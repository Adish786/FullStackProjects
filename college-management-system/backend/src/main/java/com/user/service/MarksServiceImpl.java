package com.user.service;


import com.user.entity.Marks;
import com.user.repository.MarksRepository;
import com.user.service.MarksService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarksServiceImpl implements MarksService {

    private final MarksRepository marksRepository;

    public MarksServiceImpl(MarksRepository marksRepository) {
        this.marksRepository = marksRepository;
    }

    @Override
    public Marks addMarks(Marks marks) {
        return marksRepository.save(marks);
    }

    @Override
    public Marks updateMarks(Long id, Marks updatedMarks) {
        Marks existing = marksRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Marks not found with ID: " + id));

        existing.setSubject(updatedMarks.getSubject());
        existing.setMarksObtained(updatedMarks.getMarksObtained());
        existing.setMaxMarks(updatedMarks.getMaxMarks());
        existing.setSemester(updatedMarks.getSemester());

        return marksRepository.save(existing);
    }

    @Override
    public void deleteMarks(Long id) {
        marksRepository.deleteById(id);
    }

    @Override
    public Marks getMarksById(Long id) {
        return marksRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Marks not found with ID: " + id));
    }

    @Override
    public List<Marks> getMarksByStudent(Long studentId) {
        return marksRepository.findByStudentId(studentId);
    }

    @Override
    public List<Marks> getAllMarks() {
        return marksRepository.findAll();
    }
}

