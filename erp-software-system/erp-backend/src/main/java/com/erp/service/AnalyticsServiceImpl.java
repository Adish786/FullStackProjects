package com.erp.service;

import com.erp.dto.*;
import com.erp.entity.ReportData;
import com.erp.enums.ReportPeriod;
import com.erp.repository.ReportDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AnalyticsServiceImpl implements AnalyticsService {

    @Autowired
    private ReportDataRepository reportDataRepository;

    @Override
    @Transactional(readOnly = true)
    public AnalyticsResponseDTO getAnalyticsReport(String timeRange) {
        // For now, use the string directly since we're using String in ReportData
        AnalyticsResponseDTO response = new AnalyticsResponseDTO();
        response.setTimeRange(timeRange);

        // Get latest report data for the period
        Optional<ReportData> latestReport = reportDataRepository.findLatestByPeriod(ReportPeriod.valueOf(timeRange.toUpperCase()));

        if (latestReport.isPresent()) {
            ReportData reportData = latestReport.get();
            response = createResponseFromReportData(reportData, timeRange);
        } else {
            // Return mock data if no data found
            response = createMockAnalyticsResponse(timeRange);
        }

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public AnalyticsResponseDTO getAnalyticsReport(ReportPeriod period) {
        // Convert enum to string for repository call
        return getAnalyticsReport(period.name());
    }

    private AnalyticsResponseDTO createResponseFromReportData(ReportData reportData, String timeRange) {
        AnalyticsResponseDTO response = new AnalyticsResponseDTO();
        response.setTimeRange(timeRange);

        // Set metrics
        ReportDataDTO metrics = new ReportDataDTO();
        metrics.setRevenue(reportData.getRevenue());
        metrics.setOrders(reportData.getTotalOrders());
        metrics.setCustomers(reportData.getTotalCustomers());
        metrics.setProducts(reportData.getProductsSold());

        // Set growth metrics - use actual growth data if available, otherwise calculate or use mock
        GrowthMetricsDTO growth = new GrowthMetricsDTO();
        if (reportData.getRevenueGrowth() != null) {
            growth.setRevenue(reportData.getRevenueGrowth());
            growth.setOrders(reportData.getOrdersGrowth());
            growth.setCustomers(reportData.getCustomersGrowth());
            growth.setProducts(reportData.getProductsGrowth());
        } else {
            // Use mock growth data if not available
            growth.setRevenue(18.3);
            growth.setOrders(12.5);
            growth.setCustomers(8.7);
            growth.setProducts(15.2);
        }
        metrics.setGrowth(growth);

        response.setMetrics(metrics);

        // Mock top products data (you would get this from ProductSalesRepository)
        List<ProductSalesDTO> topProducts = createMockTopProducts();
        response.setTopProducts(topProducts);

        // Mock categories data (you would get this from CategoryRevenueRepository)
        List<CategoryRevenueDTO> categories = createMockCategories();
        response.setCategories(categories);

        // Calculate sales summary
        SalesSummaryDTO salesSummary = calculateSalesSummary(reportData);
        response.setSalesSummary(salesSummary);

        return response;
    }

    private List<ProductSalesDTO> createMockTopProducts() {
        List<ProductSalesDTO> topProducts = new ArrayList<>();

        String[] productNames = {"iPhone 15 Pro", "MacBook Air", "AirPods Pro", "iPad Air", "Apple Watch"};
        Integer[] sales = {45, 32, 78, 23, 56};
        BigDecimal[] revenues = {
                BigDecimal.valueOf(67500),
                BigDecimal.valueOf(51200),
                BigDecimal.valueOf(23400),
                BigDecimal.valueOf(18400),
                BigDecimal.valueOf(22400)
        };
        Double[] growths = {25.0, 18.0, 32.0, 12.0, 21.0};

        for (int i = 0; i < 5; i++) {
            ProductSalesDTO product = new ProductSalesDTO();
            product.setName(productNames[i]);
            product.setSales(sales[i]);
            product.setRevenue(revenues[i]);
            product.setGrowth(growths[i]);
            topProducts.add(product);
        }

        return topProducts;
    }

    private List<CategoryRevenueDTO> createMockCategories() {
        List<CategoryRevenueDTO> categories = new ArrayList<>();

        String[] categoryNames = {"Electronics", "Accessories", "Furniture", "Other"};
        BigDecimal[] categoryRevenues = {
                BigDecimal.valueOf(125000),
                BigDecimal.valueOf(35000),
                BigDecimal.valueOf(20000),
                BigDecimal.valueOf(12000)
        };
        Double[] percentages = {65.0, 18.0, 10.0, 7.0};

        for (int i = 0; i < 4; i++) {
            CategoryRevenueDTO category = new CategoryRevenueDTO();
            category.setName(categoryNames[i]);
            category.setRevenue(categoryRevenues[i]);
            category.setPercentage(percentages[i]);
            categories.add(category);
        }

        return categories;
    }

    private SalesSummaryDTO calculateSalesSummary(ReportData reportData) {
        SalesSummaryDTO salesSummary = new SalesSummaryDTO();

        // Calculate average order value
        if (reportData.getTotalOrders() != null && reportData.getTotalOrders() > 0 &&
                reportData.getRevenue() != null) {
            BigDecimal avgOrderValue = reportData.getRevenue()
                    .divide(BigDecimal.valueOf(reportData.getTotalOrders()), 2, RoundingMode.HALF_UP);
            salesSummary.setAverageOrderValue(avgOrderValue);
        } else {
            salesSummary.setAverageOrderValue(BigDecimal.valueOf(289.94));
        }

        // Calculate conversion rate
        if (reportData.getTotalCustomers() != null && reportData.getTotalCustomers() > 0 &&
                reportData.getTotalOrders() != null) {
            double conversionRate = (double) reportData.getTotalOrders() / reportData.getTotalCustomers() * 100;
            salesSummary.setConversionRate(Math.round(conversionRate * 10.0) / 10.0);
        } else {
            salesSummary.setConversionRate(12.5);
        }

        // Mock customer retention
        salesSummary.setCustomerRetention(83.3);

        return salesSummary;
    }

    private AnalyticsResponseDTO createMockAnalyticsResponse(String timeRange) {
        AnalyticsResponseDTO response = new AnalyticsResponseDTO();
        response.setTimeRange(timeRange);

        // Mock metrics based on time range
        ReportDataDTO metrics = new ReportDataDTO();
        switch (timeRange.toLowerCase()) {
            case "monthly":
                metrics.setRevenue(BigDecimal.valueOf(45230));
                metrics.setOrders(156);
                metrics.setCustomers(89);
                metrics.setProducts(234);
                break;
            case "quarterly":
                metrics.setRevenue(BigDecimal.valueOf(135690));
                metrics.setOrders(468);
                metrics.setCustomers(267);
                metrics.setProducts(702);
                break;
            case "yearly":
                metrics.setRevenue(BigDecimal.valueOf(542760));
                metrics.setOrders(1872);
                metrics.setCustomers(1068);
                metrics.setProducts(2808);
                break;
            default:
                metrics.setRevenue(BigDecimal.valueOf(45230));
                metrics.setOrders(156);
                metrics.setCustomers(89);
                metrics.setProducts(234);
        }

        GrowthMetricsDTO growth = new GrowthMetricsDTO();
        growth.setRevenue(18.3);
        growth.setOrders(12.5);
        growth.setCustomers(8.7);
        growth.setProducts(15.2);
        metrics.setGrowth(growth);
        response.setMetrics(metrics);

        response.setTopProducts(createMockTopProducts());
        response.setCategories(createMockCategories());

        SalesSummaryDTO salesSummary = new SalesSummaryDTO();
        salesSummary.setAverageOrderValue(BigDecimal.valueOf(289.94));
        salesSummary.setConversionRate(12.5);
        salesSummary.setCustomerRetention(83.3);
        response.setSalesSummary(salesSummary);

        return response;
    }

    @Override
    public byte[] exportReport(String timeRange, String format) {
        AnalyticsResponseDTO report = getAnalyticsReport(timeRange);
        System.out.println("Exporting " + format + " report for: " + timeRange);
        // Return empty bytes for now - implement actual export logic later
        return new byte[0];
    }

    @Override
    public void emailReport(String timeRange, String recipientEmail) {
        System.out.println("Sending " + timeRange + " report to " + recipientEmail);
        // Implement email logic later
    }

    @Override
    public void generateAndStoreReports() {
        LocalDate today = LocalDate.now();
        System.out.println("Generating reports for: " + today);

        // Generate sample report data
        generateSampleReportData();
    }

    private void generateSampleReportData() {
        // Create sample monthly report
        ReportData monthlyReport = new ReportData();
        monthlyReport.setPeriod("MONTHLY");
        monthlyReport.setPeriodDate(LocalDate.now().withDayOfMonth(1));
        monthlyReport.setRevenue(BigDecimal.valueOf(45230));
        monthlyReport.setTotalOrders(156);
        monthlyReport.setTotalCustomers(89);
        monthlyReport.setProductsSold(234);
        monthlyReport.setRevenueGrowth(18.3);
        monthlyReport.setOrdersGrowth(12.5);
        monthlyReport.setCustomersGrowth(8.7);
        monthlyReport.setProductsGrowth(15.2);

        reportDataRepository.save(monthlyReport);

        System.out.println("Sample report data generated successfully");
    }

    private ReportPeriod convertTimeRangeToPeriod(String timeRange) {
        switch (timeRange.toLowerCase()) {
            case "daily":
                return ReportPeriod.DAILY;
            case "weekly":
                return ReportPeriod.WEEKLY;
            case "monthly":
                return ReportPeriod.MONTHLY;
            case "quarterly":
                return ReportPeriod.QUARTERLY;
            case "yearly":
                return ReportPeriod.YEARLY;
            default:
                return ReportPeriod.MONTHLY;
        }
    }

    private void generateReportForPeriod(ReportPeriod period, LocalDate periodDate) {
        // Implementation for generating and storing report data
        ReportData reportData = new ReportData();
        reportData.setPeriod(period.name());
        reportData.setPeriodDate(periodDate);

        // Add sample data based on period
        switch (period) {
            case MONTHLY:
                reportData.setRevenue(BigDecimal.valueOf(45230));
                reportData.setTotalOrders(156);
                reportData.setTotalCustomers(89);
                reportData.setProductsSold(234);
                break;
            case QUARTERLY:
                reportData.setRevenue(BigDecimal.valueOf(135690));
                reportData.setTotalOrders(468);
                reportData.setTotalCustomers(267);
                reportData.setProductsSold(702);
                break;
            case YEARLY:
                reportData.setRevenue(BigDecimal.valueOf(542760));
                reportData.setTotalOrders(1872);
                reportData.setTotalCustomers(1068);
                reportData.setProductsSold(2808);
                break;
            default:
                // Use monthly as default
                reportData.setRevenue(BigDecimal.valueOf(45230));
                reportData.setTotalOrders(156);
                reportData.setTotalCustomers(89);
                reportData.setProductsSold(234);
        }

        reportDataRepository.save(reportData);
    }

    // These methods can remain as stubs for now
    private byte[] generatePdfReport(AnalyticsResponseDTO report) {
        System.out.println("Generating PDF report for: " + report.getTimeRange());
        return new byte[0];
    }

    private byte[] generateExcelReport(AnalyticsResponseDTO report) {
        System.out.println("Generating Excel report for: " + report.getTimeRange());
        return new byte[0];
    }

    private byte[] generateCsvReport(AnalyticsResponseDTO report) {
        System.out.println("Generating CSV report for: " + report.getTimeRange());
        return new byte[0];
    }
}