package com.erp.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request DTO for creating or updating customers")
public class CustomerRequest {

    @NotBlank(message = "Customer name is required")
    @Schema(description = "Full name of the customer or business name", example = "John Doe")
    private String name;

    @Email(message = "Please provide a valid email address")
    @NotBlank(message = "Email is required")
    @Schema(description = "Email address of the customer", example = "john.doe@example.com")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[\\+]?[1-9][\\d]{0,15}$", message = "Please provide a valid phone number")
    @Schema(description = "Phone number of the customer", example = "+15551234567")
    private String phone;

    @NotBlank(message = "Address is required")
    @Schema(description = "Complete address of the customer", example = "123 Main Street, New York, NY 10001")
    private String address;

    @Pattern(regexp = "^$|^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
            message = "Please provide a valid GSTIN")
    @Schema(description = "GSTIN number for business customers", example = "29ABCDE1234F1Z5")
    private String gstin;

    @Schema(description = "Type of customer - INDIVIDUAL or BUSINESS", example = "INDIVIDUAL")
    private String type = "INDIVIDUAL";

    @Schema(description = "Status of the customer account", example = "ACTIVE")
    private String status = "ACTIVE";

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
}

