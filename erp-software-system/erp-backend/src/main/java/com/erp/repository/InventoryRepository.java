package com.erp.repository;

import com.erp.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    List<Inventory> findByProductId(Long productId);
    @Query("SELECT i FROM Inventory i WHERE i.currentStock <= i.minStockLevel")
    List<Inventory> findLowStockItems();
    @Query("SELECT i FROM Inventory i WHERE i.currentStock = 0")
    List<Inventory> findOutOfStockItems();
    @Query("SELECT i FROM Inventory i WHERE i.currentStock > i.minStockLevel")
    List<Inventory> findHealthyStockItems();

    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.currentStock <= i.minStockLevel AND i.currentStock > 0")
    Long countLowStockItems();

    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.currentStock = 0")
    Long countOutOfStockItems();

    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.currentStock > i.minStockLevel")
    Long countHealthyStockItems();

    // Async methods - Use @Query for all async methods
    @Async("erpTaskExecutor")
    @Query("SELECT i FROM Inventory i")
    CompletableFuture<List<Inventory>> findAllAsync();

    @Async("erpTaskExecutor")
    @Query("SELECT i FROM Inventory i WHERE i.id = :id")
    CompletableFuture<Optional<Inventory>> findByIdAsync(@Param("id") Long id);

    @Async("erpTaskExecutor")
    @Query("SELECT i FROM Inventory i WHERE " +
            "LOWER(i.product.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(i.product.sku) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(i.location) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(i.aisle) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(i.shelf) LIKE LOWER(CONCAT('%', :query, '%'))")
    CompletableFuture<List<Inventory>> searchInventoryAsync(@Param("query") String query);

    @Async("erpTaskExecutor")
    @Query("SELECT i FROM Inventory i WHERE i.currentStock <= i.minStockLevel")
    CompletableFuture<List<Inventory>> findLowStockItemsAsync();

    @Async("erpTaskExecutor")
    @Query("SELECT i FROM Inventory i WHERE i.currentStock = 0")
    CompletableFuture<List<Inventory>> findOutOfStockItemsAsync();

    @Async("erpTaskExecutor")
    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.currentStock <= i.minStockLevel AND i.currentStock > 0")
    CompletableFuture<Long> countLowStockItemsAsync();

    @Async("erpTaskExecutor")
    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.currentStock = 0")
    CompletableFuture<Long> countOutOfStockItemsAsync();

    @Async("erpTaskExecutor")
    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.currentStock > i.minStockLevel")
    CompletableFuture<Long> countHealthyStockItemsAsync();
}