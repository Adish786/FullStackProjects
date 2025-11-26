package com.user.repository;

import com.user.entity.Document;
import com.user.enums.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByStudentId(Long studentId);
    List<Document> findByDocumentType(DocumentType documentType);
    List<Document> findByCreatedById(Long userId);
}
