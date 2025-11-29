package com.erp.dto;

import com.erp.enums.OrderStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PurchaseOrderDTO {

    private Long id;

    @Schema(description = "Unique Purchase Order Number", example = "PO-2024-001", accessMode = Schema.AccessMode.READ_ONLY)
    private String poNumber;

    @NotNull(message = "Supplier ID is required")
    @Schema(description = "Supplier ID", example = "1", required = true)
    private Long supplierId;

    @NotNull(message = "Product ID is required")
    @Schema(description = "Product ID", example = "1", required = true)
    private Long productId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Schema(description = "Order quantity", example = "10", required = true)
    private Integer quantity;

    @NotNull(message = "Unit price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Unit price must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Unit price must have at most 2 decimal places")
    @Schema(description = "Unit price of the product", example = "2199.99", required = true)
    private BigDecimal unitPrice;

    @Schema(description = "Total amount", example = "21999.90", accessMode = Schema.AccessMode.READ_ONLY)
    private BigDecimal totalAmount;

    @Schema(description = "Order creation date", example = "2024-01-15", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDate orderDate;

    @NotNull(message = "Expected delivery date is required")
    @Future(message = "Expected delivery date must be in the future")
    @Schema(description = "Expected delivery date", example = "2024-01-25", required = true)
    private LocalDate expectedDelivery;

    @Schema(description = "Purchase order status", example = "ORDERED", accessMode = Schema.AccessMode.READ_ONLY)
    private OrderStatus status;

    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    @Schema(description = "Additional notes", example = "Urgent order for upcoming project")
    private String notes;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPoNumber() { return poNumber; }
    public void setPoNumber(String poNumber) { this.poNumber = poNumber; }

    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public LocalDate getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDate orderDate) { this.orderDate = orderDate; }

    public LocalDate getExpectedDelivery() { return expectedDelivery; }
    public void setExpectedDelivery(LocalDate expectedDelivery) { this.expectedDelivery = expectedDelivery; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}