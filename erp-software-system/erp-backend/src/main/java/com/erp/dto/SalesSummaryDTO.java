package com.erp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

@Schema(description = "Sales summary transfer object")
public class SalesSummaryDTO {

    @Schema(description = "Average order value", example = "289.94")
    private BigDecimal averageOrderValue;

    @Schema(description = "Conversion rate percentage", example = "12.5")
    private Double conversionRate;

    @Schema(description = "Customer retention percentage", example = "83.3")
    private Double customerRetention;

    // Getters and Setters
    public BigDecimal getAverageOrderValue() { return averageOrderValue; }
    public void setAverageOrderValue(BigDecimal averageOrderValue) { this.averageOrderValue = averageOrderValue; }

    public Double getConversionRate() { return conversionRate; }
    public void setConversionRate(Double conversionRate) { this.conversionRate = conversionRate; }

    public Double getCustomerRetention() { return customerRetention; }
    public void setCustomerRetention(Double customerRetention) { this.customerRetention = customerRetention; }
}