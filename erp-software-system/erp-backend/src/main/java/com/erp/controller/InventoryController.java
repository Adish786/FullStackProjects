package com.erp.controller;

import com.erp.dto.InventoryRequest;
import com.erp.dto.InventoryResponse;
import com.erp.dto.StockUpdateRequest;
import com.erp.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "http://localhost:3000")
public class InventoryController {
    private static final Logger log = LoggerFactory.getLogger(InventoryController.class);


    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService=inventoryService;
    }

    @GetMapping
    public CompletableFuture<ResponseEntity<List<InventoryResponse>>> getAllInventory() {
        log.info("GET /api/inventory - Fetching all inventory items");
        return inventoryService.getAllInventory()
                .thenApply(ResponseEntity::ok)
                .exceptionally(ex -> {
                    log.error("Error fetching inventory items: {}", ex.getMessage());
                    return ResponseEntity.internalServerError().build();
                });
    }

    @GetMapping("/{id}")
    public CompletableFuture<ResponseEntity<InventoryResponse>> getInventoryById(@PathVariable Long id) {
        log.info("GET /api/inventory/{} - Fetching inventory item by ID", id);
        return inventoryService.getInventoryById(id)
                .thenApply(optionalInventory -> optionalInventory
                        .map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build()))
                .exceptionally(ex -> {
                    log.error("Error fetching inventory item with ID {}: {}", id, ex.getMessage());
                    return ResponseEntity.internalServerError().build();
                });
    }

    @PostMapping
    public CompletableFuture<ResponseEntity<InventoryResponse>> createInventory(
            @Valid @RequestBody InventoryRequest request) {
        log.info("POST /api/inventory - Creating new inventory item");
        return inventoryService.createInventory(request)
                .thenApply(ResponseEntity::ok)
                .exceptionally(ex -> {
                    log.error("Error creating inventory item: {}", ex.getMessage());
                    return ResponseEntity.badRequest().build();
                });
    }

    @PutMapping("/{id}")
    public CompletableFuture<ResponseEntity<InventoryResponse>> updateInventory(
            @PathVariable Long id,
            @Valid @RequestBody InventoryRequest request) {
        log.info("PUT /api/inventory/{} - Updating inventory item", id);
        return inventoryService.updateInventory(id, request)
                .thenApply(ResponseEntity::ok)
                .exceptionally(ex -> {
                    log.error("Error updating inventory item with ID {}: {}", id, ex.getMessage());
                    return ResponseEntity.badRequest().build();
                });
    }

    @PutMapping("/{id}/stock")
    public CompletableFuture<ResponseEntity<InventoryResponse>> updateStock(
            @PathVariable Long id,
            @Valid @RequestBody StockUpdateRequest request) {
        log.info("PUT /api/inventory/{}/stock - Updating stock to {}", id, request.getQuantity());
        return inventoryService.updateStock(id, request)
                .thenApply(ResponseEntity::ok)
                .exceptionally(ex -> {
                    log.error("Error updating stock for inventory ID {}: {}", id, ex.getMessage());
                    return ResponseEntity.badRequest().build();
                });
    }

    @DeleteMapping("/{id}")
    public CompletableFuture<ResponseEntity<Void>> deleteInventory(@PathVariable Long id) {
        log.info("DELETE /api/inventory/{} - Deleting inventory item", id);
        return inventoryService.deleteInventory(id)
                .thenApply(v -> ResponseEntity.ok().<Void>build())
                .exceptionally(ex -> {
                    log.error("Error deleting inventory item with ID {}: {}", id, ex.getMessage());
                    return ResponseEntity.notFound().build();
                });
    }

    @GetMapping("/search")
    public CompletableFuture<ResponseEntity<List<InventoryResponse>>> searchInventory(
            @RequestParam String query) {
        log.info("GET /api/inventory/search?query={} - Searching inventory", query);
        return inventoryService.searchInventory(query)
                .thenApply(ResponseEntity::ok)
                .exceptionally(ex -> {
                    log.error("Error searching inventory with query {}: {}", query, ex.getMessage());
                    return ResponseEntity.internalServerError().build();
                });
    }

    @GetMapping("/low-stock")
    public CompletableFuture<ResponseEntity<List<InventoryResponse>>> getLowStockItems() {
        log.info("GET /api/inventory/low-stock - Fetching low stock items");
        return inventoryService.getLowStockItems()
                .thenApply(ResponseEntity::ok)
                .exceptionally(ex -> {
                    log.error("Error fetching low stock items: {}", ex.getMessage());
                    return ResponseEntity.internalServerError().build();
                });
    }

    @GetMapping("/out-of-stock")
    public CompletableFuture<ResponseEntity<List<InventoryResponse>>> getOutOfStockItems() {
        log.info("GET /api/inventory/out-of-stock - Fetching out of stock items");
        return inventoryService.getOutOfStockItems()
                .thenApply(ResponseEntity::ok)
                .exceptionally(ex -> {
                    log.error("Error fetching out of stock items: {}", ex.getMessage());
                    return ResponseEntity.internalServerError().build();
                });
    }

    @GetMapping("/stats")
    public CompletableFuture<ResponseEntity<InventoryService.InventoryStats>> getInventoryStats() {
        log.info("GET /api/inventory/stats - Fetching inventory statistics");
        return inventoryService.getInventoryStats()
                .thenApply(ResponseEntity::ok)
                .exceptionally(ex -> {
                    log.error("Error fetching inventory statistics: {}", ex.getMessage());
                    return ResponseEntity.internalServerError().build();
                });
    }
}