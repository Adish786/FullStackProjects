package com.user.service.impl;

import com.user.entity.Document;
import com.user.repository.DocumentRepository;
import com.user.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class DocumentServiceImpl implements DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Override
    @Async("documentExecutor")
    public CompletableFuture<Document> createDocument(Document document) {
        return CompletableFuture.completedFuture(documentRepository.save(document));
    }

    @Override
    @Async("documentExecutor")
    public CompletableFuture<List<Document>> getAllDocuments() {
        return CompletableFuture.completedFuture(documentRepository.findAll());
    }

    @Override
    @Async("documentExecutor")
    public CompletableFuture<Document> getDocumentById(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        return CompletableFuture.completedFuture(document);
    }

    @Override
    @Async("documentExecutor")
    public CompletableFuture<List<Document>> getDocumentsByStudent(Long studentId) {
        return CompletableFuture.completedFuture(
                documentRepository.findByStudentId(studentId)
        );
    }

    @Override
    @Async("documentExecutor")
    public CompletableFuture<Void> deleteDocument(Long id) {
        documentRepository.deleteById(id);
        return CompletableFuture.completedFuture(null);
    }
}
