package com.user.service;


import com.user.entity.Marks;
import java.util.List;

public interface MarksService {

    Marks addMarks(Marks marks);

    Marks updateMarks(Long id, Marks marks);

    void deleteMarks(Long id);

    Marks getMarksById(Long id);

    List<Marks> getMarksByStudent(Long studentId);

    List<Marks> getAllMarks();
}

