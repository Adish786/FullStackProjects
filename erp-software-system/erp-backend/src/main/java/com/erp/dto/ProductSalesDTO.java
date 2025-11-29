package com.erp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

@Schema(description = "Product sales transfer object")
public class ProductSalesDTO {

    @Schema(description = "Product name", example = "iPhone 15 Pro")
    private String name;

    @Schema(description = "Units sold", example = "45")
    private Integer sales;

    @Schema(description = "Total revenue", example = "67500.00")
    private BigDecimal revenue;

    @Schema(description = "Growth percentage", example = "25.0")
    private Double growth;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getSales() { return sales; }
    public void setSales(Integer sales) { this.sales = sales; }

    public BigDecimal getRevenue() { return revenue; }
    public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }

    public Double getGrowth() { return growth; }
    public void setGrowth(Double growth) { this.growth = growth; }
}