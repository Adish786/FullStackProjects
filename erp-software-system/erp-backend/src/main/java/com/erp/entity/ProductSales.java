package com.erp.entity;

import com.erp.enums.ReportPeriod;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "product_sales")
@Schema(description = "Product sales data for analytics")
public class ProductSales {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Auto-generated Product Sales ID", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    @Schema(description = "Product", required = true)
    private Product product;

    @Enumerated(EnumType.STRING)
    @Column(name = "period")
    @Schema(description = "Report period type", example = "MONTHLY", required = true)
    private ReportPeriod period;

    @Column(name = "period_date")
    @Schema(description = "Report period date", example = "2024-01-01", required = true)
    private LocalDate periodDate;

    @Column(name = "units_sold")
    @Schema(description = "Units sold", example = "45")
    private Integer unitsSold;

    @Column(name = "revenue")
    @Schema(description = "Total revenue", example = "67500.00")
    private BigDecimal revenue;

    @Column(name = "growth")
    @Schema(description = "Growth percentage", example = "25.0")
    private Double growth;

    @Column(name = "sales_rank") // Changed from 'rank' to 'sales_rank'
    @Schema(description = "Sales rank", example = "1")
    private Integer salesRank;

    // Constructors
    public ProductSales() {}

    public ProductSales(Product product, ReportPeriod period, LocalDate periodDate,
                        Integer unitsSold, BigDecimal revenue, Double growth, Integer salesRank) {
        this.product = product;
        this.period = period;
        this.periodDate = periodDate;
        this.unitsSold = unitsSold;
        this.revenue = revenue;
        this.growth = growth;
        this.salesRank = salesRank;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public ReportPeriod getPeriod() { return period; }
    public void setPeriod(ReportPeriod period) { this.period = period; }

    public LocalDate getPeriodDate() { return periodDate; }
    public void setPeriodDate(LocalDate periodDate) { this.periodDate = periodDate; }

    public Integer getUnitsSold() { return unitsSold; }
    public void setUnitsSold(Integer unitsSold) { this.unitsSold = unitsSold; }

    public BigDecimal getRevenue() { return revenue; }
    public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }

    public Double getGrowth() { return growth; }
    public void setGrowth(Double growth) { this.growth = growth; }

    public Integer getSalesRank() { return salesRank; }
    public void setSalesRank(Integer salesRank) { this.salesRank = salesRank; }
}