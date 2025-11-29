package com.user.service;

import com.user.entity.Document;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface DocumentService {

    CompletableFuture<Document> createDocument(Document document);

    CompletableFuture<List<Document>> getAllDocuments();

    CompletableFuture<Document> getDocumentById(Long id);

    CompletableFuture<List<Document>> getDocumentsByStudent(Long studentId);

    CompletableFuture<Void> deleteDocument(Long id);
}
