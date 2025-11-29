package com.erp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class SalesOrderDTO {

    private Long id;

    @Schema(description = "Unique Sales Order Number", example = "SO-2024-001", accessMode = Schema.AccessMode.READ_ONLY)
    private String orderNumber;

    @NotNull(message = "Customer ID is required")
    @Schema(description = "Customer ID", example = "1", required = true)
    private Long customerId;

    @Schema(description = "Order creation date", example = "2024-01-15", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDate orderDate;

    @Schema(description = "Total amount", example = "1549.97", accessMode = Schema.AccessMode.READ_ONLY)
    private BigDecimal totalAmount;

    @Schema(description = "Sales order status", example = "PENDING", accessMode = Schema.AccessMode.READ_ONLY)
    private String status;

    @Valid
    @Schema(description = "Order items", required = true)
    private List<SalesOrderItemDTO> items = new ArrayList<>();

    @Schema(description = "Shipping address")
    private String shippingAddress;

    @Schema(description = "Billing address")
    private String billingAddress;

    @Schema(description = "Payment method", example = "CREDIT_CARD")
    private String paymentMethod;

    @Schema(description = "Additional notes")
    private String notes;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public LocalDate getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDate orderDate) { this.orderDate = orderDate; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<SalesOrderItemDTO> getItems() { return items; }
    public void setItems(List<SalesOrderItemDTO> items) { this.items = items; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getBillingAddress() { return billingAddress; }
    public void setBillingAddress(String billingAddress) { this.billingAddress = billingAddress; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}