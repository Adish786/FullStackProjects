package com.erp.dto;

import com.erp.entity.Inventory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@NoArgsConstructor
@AllArgsConstructor
public class InventoryResponse {

    private Long id;
    private ProductResponse product;
    private Integer currentStock;
    private Integer minStockLevel;
    private String location;
    private String aisle;
    private String shelf;
    private String lastUpdated;

    public static InventoryResponse fromEntity(Inventory inventory) {
        if (inventory == null) return null;

        InventoryResponse response = new InventoryResponse();
        response.setId(inventory.getId());
        response.setProduct(ProductResponse.fromEntity(inventory.getProduct()));
        response.setCurrentStock(inventory.getCurrentStock());
        response.setMinStockLevel(inventory.getMinStockLevel());
        response.setLocation(inventory.getLocation());
        response.setAisle(inventory.getAisle());
        response.setShelf(inventory.getShelf());

        if (inventory.getLastUpdated() != null) {
            response.setLastUpdated(inventory.getLastUpdated()
                    .format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        }

        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProductResponse getProduct() {
        return product;
    }

    public void setProduct(ProductResponse product) {
        this.product = product;
    }

    public Integer getCurrentStock() {
        return currentStock;
    }

    public void setCurrentStock(Integer currentStock) {
        this.currentStock = currentStock;
    }

    public Integer getMinStockLevel() {
        return minStockLevel;
    }

    public void setMinStockLevel(Integer minStockLevel) {
        this.minStockLevel = minStockLevel;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getAisle() {
        return aisle;
    }

    public void setAisle(String aisle) {
        this.aisle = aisle;
    }

    public String getShelf() {
        return shelf;
    }

    public void setShelf(String shelf) {
        this.shelf = shelf;
    }

    public String getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(String lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}