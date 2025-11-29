package com.erp.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Schema(description = "Product entity representing inventory items in ERP")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Auto-generated Product ID", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @NotBlank(message = "Product name is required")
    @Size(min = 2, max = 100, message = "Product name must be between 2 and 100 characters")
    @Column(nullable = false)
    @Schema(description = "Product name", example = "Dell Laptop", required = true)
    private String name;

    @NotBlank(message = "SKU is required")
    @Size(min = 3, max = 50, message = "SKU must be between 3 and 50 characters")
    @Column(unique = true, nullable = false)
    @Schema(description = "Unique Stock Keeping Unit", example = "SKU-DEL-1001", required = true)
    private String sku;

    @NotBlank(message = "Category is required")
    @Size(max = 50, message = "Category must not exceed 50 characters")
    @Schema(description = "Product category", example = "Electronics", required = true)
    private String category;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Price must have at most 2 decimal places")
    @Schema(description = "Unit price of the product", example = "55000.00", required = true)
    private BigDecimal price;

    @NotNull(message = "Current stock is required")
    @Min(value = 0, message = "Current stock cannot be negative")
    @Schema(description = "Available stock quantity", example = "120", required = true)
    private Integer currentStock = 0;

    @NotNull(message = "Reorder level is required")
    @Min(value = 0, message = "Reorder level cannot be negative")
    @Schema(description = "Stock threshold to trigger reorder", example = "10", required = true)
    private Integer reorderLevel = 10;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    @Schema(description = "Product description", example = "High-performance business laptop")
    private String description;

    @Size(max = 20, message = "Unit must not exceed 20 characters")
    @Schema(description = "Measurement unit", example = "pcs")
    private String unit;

    // Constructors
    public Product() {}

    public Product(String name, String sku, String category, BigDecimal price,
                   Integer currentStock, Integer reorderLevel) {
        this.name = name;
        this.sku = sku;
        this.category = category;
        this.price = price;
        this.currentStock = currentStock;
        this.reorderLevel = reorderLevel;
    }

    // Business method to check if stock is low
    public boolean isLowStock() {
        return currentStock <= reorderLevel;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getCurrentStock() { return currentStock; }
    public void setCurrentStock(Integer currentStock) { this.currentStock = currentStock; }

    public Integer getReorderLevel() { return reorderLevel; }
    public void setReorderLevel(Integer reorderLevel) { this.reorderLevel = reorderLevel; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", sku='" + sku + '\'' +
                ", category='" + category + '\'' +
                ", price=" + price +
                ", currentStock=" + currentStock +
                ", reorderLevel=" + reorderLevel +
                '}';
    }
}