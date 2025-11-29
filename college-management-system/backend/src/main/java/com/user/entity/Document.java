package com.user.entity;


import com.user.enums.DocumentType;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import com.user.enums.DocumentType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@Schema(description = "Represents a document issued to a student")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Document unique ID", example = "1")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    @Schema(description = "Student to whom document belongs")
    private Student student;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Schema(description = "Type of document", example = "BONAFIDE")
    private DocumentType documentType;

    @Column(nullable = false)
    @Schema(description = "Document issue date", example = "2025-01-15")
    private LocalDate issueDate;

    @Column(columnDefinition = "TEXT")
    @Schema(description = "Document content or description")
    private String content;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    @Schema(description = "User who created this document")
    private User createdBy;

    @CreationTimestamp
    @Column(updatable = false)
    @Schema(description = "Document creation timestamp")
    private LocalDateTime createdAt;

    // Getters and Setters (your existing ones ✅)
}
