package com.user.controller;

import com.user.entity.Document;
import com.user.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/documents")
@Tag(name = "Document Management", description = "APIs for managing student documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Operation(summary = "Create a new document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document created successfully")
    })
    @PostMapping
    public CompletableFuture<ResponseEntity<Document>> createDocument(@RequestBody Document document) {
        return documentService.createDocument(document)
                .thenApply(ResponseEntity::ok);
    }

    @Operation(summary = "Get all documents")
    @GetMapping
    public CompletableFuture<ResponseEntity<List<Document>>> getAllDocuments() {
        return documentService.getAllDocuments()
                .thenApply(ResponseEntity::ok);
    }

    @Operation(summary = "Get document by ID")
    @GetMapping("/{id}")
    public CompletableFuture<ResponseEntity<Document>> getDocumentById(@PathVariable Long id) {
        return documentService.getDocumentById(id)
                .thenApply(ResponseEntity::ok);
    }

    @Operation(summary = "Get documents by Student ID")
    @GetMapping("/student/{studentId}")
    public CompletableFuture<ResponseEntity<List<Document>>> getDocumentsByStudent(
            @PathVariable Long studentId) {

        return documentService.getDocumentsByStudent(studentId)
                .thenApply(ResponseEntity::ok);
    }

    @Operation(summary = "Delete a document by ID")
    @DeleteMapping("/{id}")
    public CompletableFuture<ResponseEntity<Void>> deleteDocument(@PathVariable Long id) {

        return documentService.deleteDocument(id)
                .thenApply(v -> ResponseEntity.noContent().build());
    }
}
