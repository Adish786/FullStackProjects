package com.erp.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "suppliers")
@Schema(description = "Supplier entity representing vendors in ERP")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Auto-generated Supplier ID", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @NotBlank(message = "Supplier name is required")
    @Schema(description = "Supplier name", example = "Tech Supplies Inc.", required = true)
    private String name;

    @NotBlank(message = "Contact email is required")
    @Email(message = "Contact email should be valid")
    @Schema(description = "Contact email", example = "supply@techsupplies.com", required = true)
    private String contact;

    @Pattern(regexp = "^\\+?[\\d\\s-()]+$", message = "Phone number should be valid")
    @Schema(description = "Phone number", example = "+1 (555) 111-2222")
    private String phone;

    @Schema(description = "Supplier address")
    private String address;

    @Schema(description = "Additional notes")
    private String notes;

    // Constructors
    public Supplier() {}

    public Supplier(String name, String contact, String phone, String address) {
        this.name = name;
        this.contact = contact;
        this.phone = phone;
        this.address = address;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    @Override
    public String toString() {
        return "Supplier{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", contact='" + contact + '\'' +
                ", phone='" + phone + '\'' +
                '}';
    }
}