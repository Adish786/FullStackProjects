package com.erp.entity;

import com.erp.enums.ReportPeriod;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "category_revenue")
@Schema(description = "Category revenue data for analytics")
public class CategoryRevenue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Auto-generated Category Revenue ID", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @Column(name = "category_name")
    @Schema(description = "Category name", example = "Electronics", required = true)
    private String categoryName;

    @Enumerated(EnumType.STRING)
    @Column(name = "period")
    @Schema(description = "Report period type", example = "MONTHLY", required = true)
    private ReportPeriod period;

    @Column(name = "period_date")
    @Schema(description = "Report period date", example = "2024-01-01", required = true)
    private LocalDate periodDate;

    @Column(name = "revenue")
    @Schema(description = "Total revenue", example = "125000.00")
    private BigDecimal revenue;

    @Column(name = "percentage")
    @Schema(description = "Revenue percentage", example = "65.0")
    private Double percentage;

    // Constructors
    public CategoryRevenue() {}

    public CategoryRevenue(String categoryName, ReportPeriod period, LocalDate periodDate,
                           BigDecimal revenue, Double percentage) {
        this.categoryName = categoryName;
        this.period = period;
        this.periodDate = periodDate;
        this.revenue = revenue;
        this.percentage = percentage;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public ReportPeriod getPeriod() { return period; }
    public void setPeriod(ReportPeriod period) { this.period = period; }

    public LocalDate getPeriodDate() { return periodDate; }
    public void setPeriodDate(LocalDate periodDate) { this.periodDate = periodDate; }

    public BigDecimal getRevenue() { return revenue; }
    public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }

    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }
}