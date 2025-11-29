package com.erp.entity;

import com.erp.enums.OrderStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "purchase_orders")
@Schema(description = "Purchase Order entity representing procurement orders in ERP")
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Auto-generated Purchase Order ID", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @NotBlank(message = "PO Number is required")
    @Column(unique = true, nullable = false)
    @Schema(description = "Unique Purchase Order Number", example = "PO-2024-001", required = true)
    private String poNumber;

    @NotNull(message = "Supplier is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "supplier_id", nullable = false)
    @Schema(description = "Supplier for this purchase order", required = true)
    private Supplier supplier;

    @NotNull(message = "Product is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    @Schema(description = "Product being ordered", required = true)
    private Product product;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Schema(description = "Order quantity", example = "10", required = true)
    private Integer quantity;

    @NotNull(message = "Unit price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Unit price must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Unit price must have at most 2 decimal places")
    @Schema(description = "Unit price of the product", example = "2199.99", required = true)
    private BigDecimal unitPrice;

    @Schema(description = "Total amount (calculated)", example = "21999.90", accessMode = Schema.AccessMode.READ_ONLY)
    private BigDecimal totalAmount;

    @NotNull(message = "Order date is required")
    @Schema(description = "Order creation date", example = "2024-01-15", required = true)
    private LocalDate orderDate;

    @NotNull(message = "Expected delivery date is required")
    @Future(message = "Expected delivery date must be in the future")
    @Schema(description = "Expected delivery date", example = "2024-01-25", required = true)
    private LocalDate expectedDelivery;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Status is required")
    @Schema(description = "Purchase order status", example = "ORDERED", required = true)
    private OrderStatus status;

    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    @Schema(description = "Additional notes", example = "Urgent order for upcoming project")
    private String notes;

    // Constructors
    public PurchaseOrder() {
        this.orderDate = LocalDate.now();
        this.status = OrderStatus.ORDERED;
    }

    public PurchaseOrder(String poNumber, Supplier supplier, Product product, Integer quantity,
                         BigDecimal unitPrice, LocalDate expectedDelivery, String notes) {
        this();
        this.poNumber = poNumber;
        this.supplier = supplier;
        this.product = product;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.expectedDelivery = expectedDelivery;
        this.notes = notes;
        calculateTotalAmount();
    }

    // Business methods
    @PrePersist
    @PreUpdate
    public void calculateTotalAmount() {
        if (this.unitPrice != null && this.quantity != null) {
            this.totalAmount = this.unitPrice.multiply(BigDecimal.valueOf(this.quantity));
        }
    }

    public boolean canBeCancelled() {
        return this.status == OrderStatus.ORDERED || this.status == OrderStatus.DISPATCHED;
    }

    public boolean canBeUpdated() {
        return this.status != OrderStatus.RECEIVED && this.status != OrderStatus.CANCELLED;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPoNumber() { return poNumber; }
    public void setPoNumber(String poNumber) { this.poNumber = poNumber; }

    public Supplier getSupplier() { return supplier; }
    public void setSupplier(Supplier supplier) { this.supplier = supplier; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
        calculateTotalAmount();
    }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
        calculateTotalAmount();
    }

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

    @Override
    public String toString() {
        return "PurchaseOrder{" +
                "id=" + id +
                ", poNumber='" + poNumber + '\'' +
                ", supplier=" + (supplier != null ? supplier.getName() : "null") +
                ", product=" + (product != null ? product.getName() : "null") +
                ", quantity=" + quantity +
                ", unitPrice=" + unitPrice +
                ", totalAmount=" + totalAmount +
                ", orderDate=" + orderDate +
                ", expectedDelivery=" + expectedDelivery +
                ", status=" + status +
                '}';
    }
}