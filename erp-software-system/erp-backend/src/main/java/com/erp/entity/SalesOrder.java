package com.erp.entity;

import com.erp.enums.SalesOrderStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sales_orders")
@Schema(description = "Sales Order entity representing customer orders in ERP")
public class SalesOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Auto-generated Sales Order ID", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @NotBlank(message = "Order number is required")
    @Column(unique = true, nullable = false)
    @Schema(description = "Unique Sales Order Number", example = "SO-2024-001", required = true)
    private String orderNumber;

    @NotNull(message = "Customer is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    @Schema(description = "Customer who placed the order", required = true)
    private Customer customer;

    @NotNull(message = "Order date is required")
    @Schema(description = "Order creation date", example = "2024-01-15", required = true)
    private LocalDate orderDate;

    @Schema(description = "Total amount (calculated)", example = "1549.97", accessMode = Schema.AccessMode.READ_ONLY)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Status is required")
    @Schema(description = "Sales order status", example = "PENDING", required = true)
    private SalesOrderStatus status;

    @OneToMany(mappedBy = "salesOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @Schema(description = "Order items")
    private List<SalesOrderItem> items = new ArrayList<>();

    @Schema(description = "Shipping address")
    private String shippingAddress;

    @Schema(description = "Billing address")
    private String billingAddress;

    @Schema(description = "Payment method", example = "CREDIT_CARD")
    private String paymentMethod;

    @Schema(description = "Additional notes")
    private String notes;

    // Constructors
    public SalesOrder() {
        this.orderDate = LocalDate.now();
        this.status = SalesOrderStatus.PENDING;
        this.totalAmount = BigDecimal.ZERO;
    }

    public SalesOrder(String orderNumber, Customer customer, LocalDate orderDate) {
        this();
        this.orderNumber = orderNumber;
        this.customer = customer;
        this.orderDate = orderDate;
    }

    // Business methods
    public void addItem(SalesOrderItem item) {
        items.add(item);
        item.setSalesOrder(this);
        calculateTotalAmount();
    }

    public void removeItem(SalesOrderItem item) {
        items.remove(item);
        item.setSalesOrder(null);
        calculateTotalAmount();
    }

    public void calculateTotalAmount() {
        this.totalAmount = items.stream()
                .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public boolean canBeCancelled() {
        return this.status == SalesOrderStatus.PENDING || this.status == SalesOrderStatus.APPROVED;
    }

    public boolean canBeUpdated() {
        return this.status != SalesOrderStatus.DELIVERED && this.status != SalesOrderStatus.CANCELLED;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public LocalDate getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDate orderDate) { this.orderDate = orderDate; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public SalesOrderStatus getStatus() { return status; }
    public void setStatus(SalesOrderStatus status) { this.status = status; }

    public List<SalesOrderItem> getItems() { return items; }
    public void setItems(List<SalesOrderItem> items) {
        this.items = items;
        calculateTotalAmount();
    }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getBillingAddress() { return billingAddress; }
    public void setBillingAddress(String billingAddress) { this.billingAddress = billingAddress; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    @Override
    public String toString() {
        return "SalesOrder{" +
                "id=" + id +
                ", orderNumber='" + orderNumber + '\'' +
                ", customer=" + (customer != null ? customer.getName() : "null") +
                ", orderDate=" + orderDate +
                ", totalAmount=" + totalAmount +
                ", status=" + status +
                '}';
    }
}