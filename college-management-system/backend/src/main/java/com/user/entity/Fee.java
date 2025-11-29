package com.user.entity;

import com.user.enums.PaymentStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fees")
@Schema(name = "Fee", description = "Represents the fee details of a student, including total, paid, due amounts and payment status")
public class Fee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Unique ID of the fee record", example = "1")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    @Schema(description = "Student associated with this fee record")
    private Student student;

    @Column(nullable = false, precision = 10, scale = 2)
    @Schema(description = "Total fee amount for the student", example = "5000.00")
    private BigDecimal totalAmount;

    @Column(nullable = false, precision = 10, scale = 2)
    @Schema(description = "Amount already paid by the student", example = "3000.00")
    private BigDecimal paidAmount;

    @Column(nullable = false, precision = 10, scale = 2)
    @Schema(description = "Remaining due amount", example = "2000.00")
    private BigDecimal dueAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Schema(description = "Current payment status of the fee", example = "PARTIAL")
    private PaymentStatus paymentStatus;

    @Column(columnDefinition = "JSON")
    @Schema(description = "JSON array of payment dates", example = "[\"2025-01-01\", \"2025-02-01\"]")
    private String paymentDates;

    @CreationTimestamp
    @Column(updatable = false)
    @Schema(description = "Timestamp when the fee record was created", example = "2025-01-01T10:00:00")
    private LocalDateTime createdAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; }

    public BigDecimal getDueAmount() { return dueAmount; }
    public void setDueAmount(BigDecimal dueAmount) { this.dueAmount = dueAmount; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getPaymentDates() { return paymentDates; }
    public void setPaymentDates(String paymentDates) { this.paymentDates = paymentDates; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
