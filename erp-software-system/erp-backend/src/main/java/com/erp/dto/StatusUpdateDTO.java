package com.erp.dto;

import com.erp.enums.OrderStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

public class StatusUpdateDTO {

    @NotNull(message = "Status is required")
    @Schema(description = "New order status", example = "DISPATCHED", required = true)
    private OrderStatus status;

    // Getters and Setters
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
}