package com.erp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

@Schema(description = "Report data transfer object")
public class ReportDataDTO {

    @Schema(description = "Total revenue", example = "45230.00")
    private BigDecimal revenue;

    @Schema(description = "Total orders", example = "156")
    private Integer orders;

    @Schema(description = "Total customers", example = "89")
    private Integer customers;

    @Schema(description = "Products sold", example = "234")
    private Integer products;

    @Schema(description = "Growth metrics")
    private GrowthMetricsDTO growth;

    // Getters and Setters
    public BigDecimal getRevenue() { return revenue; }
    public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }

    public Integer getOrders() { return orders; }
    public void setOrders(Integer orders) { this.orders = orders; }

    public Integer getCustomers() { return customers; }
    public void setCustomers(Integer customers) { this.customers = customers; }

    public Integer getProducts() { return products; }
    public void setProducts(Integer products) { this.products = products; }

    public GrowthMetricsDTO getGrowth() { return growth; }
    public void setGrowth(GrowthMetricsDTO growth) { this.growth = growth; }
}