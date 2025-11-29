package com.erp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "Complete analytics response")
public class AnalyticsResponseDTO {

    @Schema(description = "Time period", example = "monthly")
    private String timeRange;

    @Schema(description = "Key metrics data")
    private ReportDataDTO metrics;

    @Schema(description = "Top selling products")
    private List<ProductSalesDTO> topProducts;

    @Schema(description = "Revenue by category")
    private List<CategoryRevenueDTO> categories;

    @Schema(description = "Sales summary")
    private SalesSummaryDTO salesSummary;

    // Getters and Setters
    public String getTimeRange() { return timeRange; }
    public void setTimeRange(String timeRange) { this.timeRange = timeRange; }

    public ReportDataDTO getMetrics() { return metrics; }
    public void setMetrics(ReportDataDTO metrics) { this.metrics = metrics; }

    public List<ProductSalesDTO> getTopProducts() { return topProducts; }
    public void setTopProducts(List<ProductSalesDTO> topProducts) { this.topProducts = topProducts; }

    public List<CategoryRevenueDTO> getCategories() { return categories; }
    public void setCategories(List<CategoryRevenueDTO> categories) { this.categories = categories; }

    public SalesSummaryDTO getSalesSummary() { return salesSummary; }
    public void setSalesSummary(SalesSummaryDTO salesSummary) { this.salesSummary = salesSummary; }
}