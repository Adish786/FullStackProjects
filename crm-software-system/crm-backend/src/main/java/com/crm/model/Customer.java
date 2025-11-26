package com.crm.model;


import jakarta.persistence.*;


@Entity
@Table(name = "customers")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String email;
    private String phone;
    private String company;
    private String address;

    @ManyToOne
    @JoinColumn(name = "assigned_sales_rep_id")
    private User assignedSalesRep;

    private String notes;

    // Constructors, Getters and Setters
    public Customer() {}

    public Customer(String name, String email, String phone, String company, String address, User assignedSalesRep, String notes) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.company = company;
        this.address = address;
        this.assignedSalesRep = assignedSalesRep;
        this.notes = notes;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public User getAssignedSalesRep() { return assignedSalesRep; }
    public void setAssignedSalesRep(User assignedSalesRep) { this.assignedSalesRep = assignedSalesRep; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
