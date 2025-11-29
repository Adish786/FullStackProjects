package com.user.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class MarksRequestDTO {

    @Schema(description = "Student ID", example = "1")
    private Long studentId;

    @Schema(description = "Subject name", example = "Mathematics")
    private String subject;

    @Schema(description = "Marks obtained", example = "85")
    private Integer marksObtained;

    @Schema(description = "Maximum marks", example = "100")
    private Integer maxMarks;

    @Schema(description = "Semester number", example = "1")
    private Integer semester;

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public Integer getMarksObtained() {
        return marksObtained;
    }

    public void setMarksObtained(Integer marksObtained) {
        this.marksObtained = marksObtained;
    }

    public Integer getMaxMarks() {
        return maxMarks;
    }

    public void setMaxMarks(Integer maxMarks) {
        this.maxMarks = maxMarks;
    }

    public Integer getSemester() {
        return semester;
    }

    public void setSemester(Integer semester) {
        this.semester = semester;
    }
}

