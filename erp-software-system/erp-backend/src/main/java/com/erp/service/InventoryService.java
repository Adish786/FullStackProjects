package com.erp.service;

import com.erp.dto.InventoryRequest;
import com.erp.dto.InventoryResponse;
import com.erp.dto.StockUpdateRequest;
import com.erp.entity.Inventory;
import com.erp.entity.Product;
import com.erp.repository.InventoryRepository;
import com.erp.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class InventoryService {
    private static final Logger log = LoggerFactory.getLogger(InventoryService.class);

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;

    public InventoryService(InventoryRepository inventoryRepository,ProductRepository productRepository) {
    this.inventoryRepository=inventoryRepository;
    this.productRepository=productRepository;
    }

    @Async("erpTaskExecutor")
    @Transactional(readOnly = true)
    public CompletableFuture<List<InventoryResponse>> getAllInventory() {
        log.info("Fetching all inventory items asynchronously");
        return inventoryRepository.findAllAsync()
                .thenApply(inventoryList -> inventoryList.stream()
                        .map(InventoryResponse::fromEntity)
                        .collect(Collectors.toList()));
    }

    @Async("erpTaskExecutor")
    @Transactional(readOnly = true)
    public CompletableFuture<Optional<InventoryResponse>> getInventoryById(Long id) {
        log.info("Fetching inventory item by ID: {} asynchronously", id);
        return inventoryRepository.findByIdAsync(id)
                .thenApply(optionalInventory -> optionalInventory.map(InventoryResponse::fromEntity));
    }

    @Async("erpTaskExecutor")
    @Transactional
    public CompletableFuture<InventoryResponse> createInventory(InventoryRequest request) {
        log.info("Creating new inventory item asynchronously for product ID: {}", request.getProductId());

        return CompletableFuture.supplyAsync(() -> {
            // Validate product exists
            Product product = productRepository.findById(request.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + request.getProductId()));

            // Check if inventory already exists for this product
            List<Inventory> existingInventory = inventoryRepository.findByProductId(request.getProductId());
            if (!existingInventory.isEmpty()) {
                throw new RuntimeException("Inventory already exists for product: " + product.getName());
            }

            Inventory inventory = new Inventory();
            mapRequestToEntity(request, inventory, product);

            Inventory savedInventory = inventoryRepository.save(inventory);
            log.info("Inventory item created successfully with ID: {}", savedInventory.getId());
            return InventoryResponse.fromEntity(savedInventory);
        });
    }

    @Async("erpTaskExecutor")
    @Transactional
    public CompletableFuture<InventoryResponse> updateInventory(Long id, InventoryRequest request) {
        log.info("Updating inventory item with ID: {} asynchronously", id);

        return inventoryRepository.findByIdAsync(id)
                .thenApply(optionalInventory -> {
                    Inventory inventory = optionalInventory.orElseThrow(() ->
                            new RuntimeException("Inventory item not found with ID: " + id));

                    // Validate product exists if changing product
                    if (!inventory.getProduct().getId().equals(request.getProductId())) {
                        Product product = productRepository.findById(request.getProductId())
                                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + request.getProductId()));
                        inventory.setProduct(product);
                    }

                    mapRequestToEntity(request, inventory, inventory.getProduct());
                    Inventory updatedInventory = inventoryRepository.save(inventory);
                    log.info("Inventory item updated successfully with ID: {}", updatedInventory.getId());
                    return InventoryResponse.fromEntity(updatedInventory);
                });
    }

    @Async("erpTaskExecutor")
    @Transactional
    public CompletableFuture<InventoryResponse> updateStock(Long id, StockUpdateRequest request) {
        log.info("Updating stock for inventory ID: {} to {} asynchronously", id, request.getQuantity());

        return inventoryRepository.findByIdAsync(id)
                .thenApply(optionalInventory -> {
                    Inventory inventory = optionalInventory.orElseThrow(() ->
                            new RuntimeException("Inventory item not found with ID: " + id));

                    if (request.getQuantity() < 0) {
                        throw new RuntimeException("Stock quantity cannot be negative");
                    }

                    inventory.setCurrentStock(request.getQuantity());
                    Inventory updatedInventory = inventoryRepository.save(inventory);
                    log.info("Stock updated successfully for inventory ID: {}", id);
                    return InventoryResponse.fromEntity(updatedInventory);
                });
    }

    @Async("erpTaskExecutor")
    @Transactional
    public CompletableFuture<Void> deleteInventory(Long id) {
        log.info("Deleting inventory item with ID: {} asynchronously", id);

        return inventoryRepository.findByIdAsync(id)
                .thenAccept(optionalInventory -> {
                    Inventory inventory = optionalInventory.orElseThrow(() ->
                            new RuntimeException("Inventory item not found with ID: " + id));
                    inventoryRepository.delete(inventory);
                    log.info("Inventory item deleted successfully with ID: {}", id);
                });
    }

    @Async("erpTaskExecutor")
    @Transactional(readOnly = true)
    public CompletableFuture<List<InventoryResponse>> searchInventory(String query) {
        log.info("Searching inventory with query: {} asynchronously", query);
        return inventoryRepository.searchInventoryAsync(query)
                .thenApply(inventoryList -> inventoryList.stream()
                        .map(InventoryResponse::fromEntity)
                        .collect(Collectors.toList()));
    }

    @Async("erpTaskExecutor")
    @Transactional(readOnly = true)
    public CompletableFuture<List<InventoryResponse>> getLowStockItems() {
        log.info("Fetching low stock items asynchronously");
        return inventoryRepository.findLowStockItemsAsync()
                .thenApply(inventoryList -> inventoryList.stream()
                        .map(InventoryResponse::fromEntity)
                        .collect(Collectors.toList()));
    }

    @Async("erpTaskExecutor")
    @Transactional(readOnly = true)
    public CompletableFuture<List<InventoryResponse>> getOutOfStockItems() {
        log.info("Fetching out of stock items asynchronously");
        return inventoryRepository.findOutOfStockItemsAsync()
                .thenApply(inventoryList -> inventoryList.stream()
                        .map(InventoryResponse::fromEntity)
                        .collect(Collectors.toList()));
    }

    @Async("erpTaskExecutor")
    @Transactional(readOnly = true)
    public CompletableFuture<InventoryStats> getInventoryStats() {
        log.info("Fetching inventory statistics asynchronously");

        CompletableFuture<Long> healthyCount = inventoryRepository.countHealthyStockItemsAsync();
        CompletableFuture<Long> lowCount = inventoryRepository.countLowStockItemsAsync();
        CompletableFuture<Long> outOfStockCount = inventoryRepository.countOutOfStockItemsAsync();
        CompletableFuture<Long> totalCount = CompletableFuture.completedFuture(inventoryRepository.count());

        return CompletableFuture.allOf(healthyCount, lowCount, outOfStockCount, totalCount)
                .thenApply(v -> new InventoryStats(
                        healthyCount.join(),
                        lowCount.join(),
                        outOfStockCount.join(),
                        totalCount.join()
                ));
    }

    private void mapRequestToEntity(InventoryRequest request, Inventory inventory, Product product) {
        inventory.setProduct(product);
        inventory.setCurrentStock(request.getCurrentStock());
        inventory.setMinStockLevel(request.getMinStockLevel());
        inventory.setLocation(request.getLocation());
        inventory.setAisle(request.getAisle());
        inventory.setShelf(request.getShelf());
    }

    // Inner class for inventory statistics
    public static class InventoryStats {
        private final Long healthyStockCount;
        private final Long lowStockCount;
        private final Long outOfStockCount;
        private final Long totalCount;

        public InventoryStats(Long healthyStockCount, Long lowStockCount, Long outOfStockCount, Long totalCount) {
            this.healthyStockCount = healthyStockCount;
            this.lowStockCount = lowStockCount;
            this.outOfStockCount = outOfStockCount;
            this.totalCount = totalCount;
        }

        // Getters
        public Long getHealthyStockCount() { return healthyStockCount; }
        public Long getLowStockCount() { return lowStockCount; }
        public Long getOutOfStockCount() { return outOfStockCount; }
        public Long getTotalCount() { return totalCount; }
    }
}