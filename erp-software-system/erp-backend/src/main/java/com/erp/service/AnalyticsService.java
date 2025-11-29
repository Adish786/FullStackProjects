package com.erp.service;

import com.erp.dto.AnalyticsResponseDTO;
import com.erp.enums.ReportPeriod;

public interface AnalyticsService {

    AnalyticsResponseDTO getAnalyticsReport(String timeRange);

    AnalyticsResponseDTO getAnalyticsReport(ReportPeriod period);

    byte[] exportReport(String timeRange, String format);

    void emailReport(String timeRange, String recipientEmail);

    void generateAndStoreReports();
}