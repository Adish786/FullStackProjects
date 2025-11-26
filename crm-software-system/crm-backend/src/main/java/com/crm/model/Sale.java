package com.crm.model;

import com.crm.enums.SaleStatus;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "sales")
public class Sale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    private Double amount;

    @Enumerated(EnumType.STRING)
    private SaleStatus status;

    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "assigned_sales_rep_id")
    private User assignedSalesRep;

    // Constructors, Getters and Setters
    public Sale() {}

    public Sale(Customer customer, Double amount, SaleStatus status, LocalDate date, User assignedSalesRep) {
        this.customer = customer;
        this.amount = amount;
        this.status = status;
        this.date = date;
        this.assignedSalesRep = assignedSalesRep;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public SaleStatus getStatus() { return status; }
    public void setStatus(SaleStatus status) { this.status = status; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public User getAssignedSalesRep() { return assignedSalesRep; }
    public void setAssignedSalesRep(User assignedSalesRep) { this.assignedSalesRep = assignedSalesRep; }
}


