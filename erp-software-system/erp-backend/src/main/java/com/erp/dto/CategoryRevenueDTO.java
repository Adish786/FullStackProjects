package com.erp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

@Schema(description = "Category revenue transfer object")
public class CategoryRevenueDTO {

    @Schema(description = "Category name", example = "Electronics")
    private String name;

    @Schema(description = "Total revenue", example = "125000.00")
    private BigDecimal revenue;

    @Schema(description = "Revenue percentage", example = "65.0")
    private Double percentage;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getRevenue() { return revenue; }
    public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }

    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }
}