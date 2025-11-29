package com.erp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class SalesOrderItemDTO {

    @NotNull(message = "Product ID is required")
    @Schema(description = "Product ID", example = "1", required = true)
    private Long productId;

    @NotNull(message = "Quantity is required")
    @Schema(description = "Quantity", example = "2", required = true)
    private Integer quantity;

    @NotNull(message = "Unit price is required")
    @Schema(description = "Unit price", example = "1299.99", required = true)
    private BigDecimal unitPrice;

    // Getters and Setters
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
}