package com.erp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

@Schema(description = "Growth metrics transfer object")
public class GrowthMetricsDTO {

    @Schema(description = "Revenue growth percentage", example = "18.3")
    private Double revenue; // Changed from BigDecimal to Double

    @Schema(description = "Orders growth percentage", example = "12.5")
    private Double orders; // Changed from Integer to Double

    @Schema(description = "Customers growth percentage", example = "8.7")
    private Double customers; // Changed from BigDecimal to Double

    @Schema(description = "Products growth percentage", example = "15.2")
    private Double products; // Changed from BigDecimal to Double

    // Getters and Setters
    public Double getRevenue() { return revenue; }
    public void setRevenue(Double revenue) { this.revenue = revenue; }

    public Double getOrders() { return orders; }
    public void setOrders(Double orders) { this.orders = orders; }

    public Double getCustomers() { return customers; }
    public void setCustomers(Double customers) { this.customers = customers; }

    public Double getProducts() { return products; }
    public void setProducts(Double products) { this.products = products; }
}