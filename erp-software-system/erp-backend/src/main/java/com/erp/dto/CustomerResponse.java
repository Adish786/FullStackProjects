package com.erp.dto;

import com.erp.entity.Customer;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "Response DTO for customer operations")
public class CustomerResponse {

    @Schema(description = "Unique identifier for the customer", example = "1")
    private Long id;

    @Schema(description = "Full name of the customer or business name", example = "John Doe")
    private String name;

    @Schema(description = "Email address of the customer", example = "john.doe@example.com")
    private String email;

    @Schema(description = "Phone number of the customer", example = "+15551234567")
    private String phone;

    @Schema(description = "Complete address of the customer", example = "123 Main Street, New York, NY 10001")
    private String address;

    @Schema(description = "GSTIN number for business customers", example = "29ABCDE1234F1Z5")
    private String gstin;

    @Schema(description = "Type of customer - INDIVIDUAL or BUSINESS", example = "INDIVIDUAL")
    private String type;

    @Schema(description = "Status of the customer account", example = "ACTIVE")
    private String status;

    @Schema(description = "Timestamp when customer was created")
    private LocalDateTime createdAt;

    @Schema(description = "Timestamp when customer was last updated")
    private LocalDateTime updatedAt;

    // Default constructor
    public CustomerResponse() {
    }

    // All arguments constructor
    public CustomerResponse(Long id, String name, String email, String phone, String address,
                            String gstin, String type, String status, LocalDateTime createdAt,
                            LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.gstin = gstin;
        this.type = type;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static CustomerResponse fromEntity(Customer customer) {
        return new CustomerResponse(
                customer.getId(),
                customer.getName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getAddress(),
                customer.getGstin(),
                customer.getType() != null ? customer.getType().name() : null,
                customer.getStatus() != null ? customer.getStatus().name() : null,
                customer.getCreatedAt(),
                customer.getUpdatedAt()
        );
    }

    // Getters and Setters
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
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

    // toString method
    @Override
    public String toString() {
        return "CustomerResponse{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", address='" + address + '\'' +
                ", gstin='" + gstin + '\'' +
                ", type='" + type + '\'' +
                ", status='" + status + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }

    // equals and hashCode methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        CustomerResponse that = (CustomerResponse) o;

        return id != null ? id.equals(that.id) : that.id == null;
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
}