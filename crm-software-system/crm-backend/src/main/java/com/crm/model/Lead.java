package com.crm.model;


import com.crm.enums.LeadStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "leads")
public class Lead {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String contactInfo;
    private String source;

    @Enumerated(EnumType.STRING)
    private LeadStatus status;

    @ManyToOne
    @JoinColumn(name = "assigned_sales_rep_id")
    private User assignedSalesRep;

    // Constructors, Getters and Setters
    public Lead() {}

    public Lead(String name, String contactInfo, String source, LeadStatus status, User assignedSalesRep) {
        this.name = name;
        this.contactInfo = contactInfo;
        this.source = source;
        this.status = status;
        this.assignedSalesRep = assignedSalesRep;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public LeadStatus getStatus() { return status; }
    public void setStatus(LeadStatus status) { this.status = status; }
    public User getAssignedSalesRep() { return assignedSalesRep; }
    public void setAssignedSalesRep(User assignedSalesRep) { this.assignedSalesRep = assignedSalesRep; }
}


