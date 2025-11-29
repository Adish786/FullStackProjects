package com.erp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "report_data")
public class ReportData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "period")
    private String period;

    @Column(name = "period_date")
    private LocalDate periodDate;

    @Column(name = "revenue")
    private BigDecimal revenue;

    @Column(name = "total_orders")
    private Integer totalOrders; // Changed from BigDecimal to Integer

    @Column(name = "total_customers")
    private Integer totalCustomers; // Changed from BigDecimal to Integer

    @Column(name = "products_sold")
    private Integer productsSold;

    // Additional fields for growth metrics
    @Column(name = "revenue_growth")
    private Double revenueGrowth;

    @Column(name = "orders_growth")
    private Double ordersGrowth;

    @Column(name = "customers_growth")
    private Double customersGrowth;

    @Column(name = "products_growth")
    private Double productsGrowth;

    // Constructors
    public ReportData() {}

    public ReportData(String period, LocalDate periodDate, BigDecimal revenue,
                      Integer totalOrders, Integer totalCustomers, Integer productsSold) {
        this.period = period;
        this.periodDate = periodDate;
        this.revenue = revenue;
        this.totalOrders = totalOrders;
        this.totalCustomers = totalCustomers;
        this.productsSold = productsSold;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }

    public LocalDate getPeriodDate() { return periodDate; }
    public void setPeriodDate(LocalDate periodDate) { this.periodDate = periodDate; }

    public BigDecimal getRevenue() { return revenue; }
    public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }

    public Integer getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Integer totalOrders) { this.totalOrders = totalOrders; }

    public Integer getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(Integer totalCustomers) { this.totalCustomers = totalCustomers; }

    public Integer getProductsSold() { return productsSold; }
    public void setProductsSold(Integer productsSold) { this.productsSold = productsSold; }

    public Double getRevenueGrowth() { return revenueGrowth; }
    public void setRevenueGrowth(Double revenueGrowth) { this.revenueGrowth = revenueGrowth; }

    public Double getOrdersGrowth() { return ordersGrowth; }
    public void setOrdersGrowth(Double ordersGrowth) { this.ordersGrowth = ordersGrowth; }

    public Double getCustomersGrowth() { return customersGrowth; }
    public void setCustomersGrowth(Double customersGrowth) { this.customersGrowth = customersGrowth; }

    public Double getProductsGrowth() { return productsGrowth; }
    public void setProductsGrowth(Double productsGrowth) { this.productsGrowth = productsGrowth; }
}