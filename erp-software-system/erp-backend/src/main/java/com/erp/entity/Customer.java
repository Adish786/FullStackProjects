package com.erp.entity;

import com.erp.enums.CustomerStatus;
import com.erp.enums.CustomerType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Customer entity representing business or individual customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Unique identifier for the customer", example = "1")
    private Long id;

    @NotBlank(message = "Customer name is required")
    @Column(nullable = false)
    @Schema(description = "Full name of the customer or business name", example = "John Doe")
    private String name;

    @Email(message = "Please provide a valid email address")
    @NotBlank(message = "Email is required")
    @Column(nullable = false, unique = true)
    @Schema(description = "Email address of the customer", example = "john.doe@example.com")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[\\+]?[1-9][\\d]{0,15}$", message = "Please provide a valid phone number")
    @Column(nullable = false)
    @Schema(description = "Phone number of the customer", example = "+15551234567")
    private String phone;

    @NotBlank(message = "Address is required")
    @Column(columnDefinition = "TEXT", nullable = false)
    @Schema(description = "Complete address of the customer", example = "123 Main Street, New York, NY 10001")
    private String address;

    @Column(name = "gstin", unique = true)
    @Pattern(regexp = "^$|^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
            message = "Please provide a valid GSTIN")
    @Schema(description = "GSTIN number for business customers", example = "29ABCDE1234F1Z5")
    private String gstin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Schema(description = "Type of customer - INDIVIDUAL or BUSINESS")
    private CustomerType type = CustomerType.INDIVIDUAL;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Schema(description = "Status of the customer account")
    private CustomerStatus status = CustomerStatus.ACTIVE;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    @Schema(description = "Timestamp when customer was created")
    private LocalDateTime createdAt;

    @Schema(description = "Company name", example = "Acme Corporation")
    private String company;

    @Schema(description = "Billing address")
    private String billingAddress;
    private LocalDateTime updatedAt;
    @Schema(description = "Shipping address")
    private String shippingAddress;

    @Schema(description = "Customer type", example = "INDIVIDUAL")
    private String customerType;

    @Schema(description = "Credit limit", example = "10000.00")
    private BigDecimal creditLimit;

    @Schema(description = "Current balance", example = "2500.00")
    private BigDecimal currentBalance;

    @Schema(description = "Additional notes")
    private String notes;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getGstin() {
        return gstin;
    }

    public void setGstin(String gstin) {
        this.gstin = gstin;
    }

    public CustomerType getType() {
        return type;
    }

    public void setType(CustomerType type) {
        this.type = type;
    }

    public CustomerStatus getStatus() {
        return status;
    }

    public void setStatus(CustomerStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getBillingAddress() {
        return billingAddress;
    }

    public void setBillingAddress(String billingAddress) {
        this.billingAddress = billingAddress;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getCustomerType() {
        return customerType;
    }

    public void setCustomerType(String customerType) {
        this.customerType = customerType;
    }

    public BigDecimal getCreditLimit() {
        return creditLimit;
    }

    public void setCreditLimit(BigDecimal creditLimit) {
        this.creditLimit = creditLimit;
    }

    public BigDecimal getCurrentBalance() {
        return currentBalance;
    }

    public void setCurrentBalance(BigDecimal currentBalance) {
        this.currentBalance = currentBalance;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}