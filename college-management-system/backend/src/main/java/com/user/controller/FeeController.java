package com.user.controller;

import com.user.entity.Fee;
import com.user.service.FeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/fees")
@Tag(name = "Fee Controller", description = "APIs for managing student fees")
@SecurityRequirement(name = "bearerAuth")
public class FeeController {

    private final FeeService feeService;

    public FeeController(FeeService feeService) {
        this.feeService = feeService;
    }

    @Operation(summary = "Create new fee")
    @PostMapping
    public CompletableFuture<ResponseEntity<Fee>> createFee(@RequestBody Fee fee) {
        return feeService.createFee(fee)
                .thenApply(ResponseEntity::ok);
    }

    @Operation(summary = "Update fee by ID")
    @PutMapping("/{id}")
    public CompletableFuture<ResponseEntity<Fee>> updateFee(@PathVariable Long id,
                                                            @RequestBody Fee fee) {
        return feeService.updateFee(id, fee)
                .thenApply(ResponseEntity::ok);
    }

    @Operation(summary = "Get fee by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Fee> getFee(@PathVariable Long id) {
        return ResponseEntity.ok(feeService.getFeeById(id));
    }

    @Operation(summary = "Get all fees")
    @GetMapping
    public ResponseEntity<List<Fee>> getAllFees() {
        return ResponseEntity.ok(feeService.getAllFees());
    }

    @Operation(summary = "Get fees by student ID")
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Fee>> getFeesByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(feeService.getFeesByStudentId(studentId));
    }

    @Operation(summary = "Delete fee by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFee(@PathVariable Long id) {
        feeService.deleteFee(id);
        return ResponseEntity.ok("Fee deleted successfully");
    }
}
