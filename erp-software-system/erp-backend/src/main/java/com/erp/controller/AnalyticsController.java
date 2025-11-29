package com.erp.controller;

import com.erp.dto.AnalyticsResponseDTO;
import com.erp.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Analytics & Reports", description = "APIs for analytics and reporting in the ERP system")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping
    @Operation(summary = "Get analytics report", description = "Retrieve analytics report for the specified time range")
    public ResponseEntity<AnalyticsResponseDTO> getAnalyticsReport(
            @RequestParam(defaultValue = "monthly") String timeRange) {
        try {
            AnalyticsResponseDTO report = analyticsService.getAnalyticsReport(timeRange);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/export")
    @Operation(summary = "Export analytics report", description = "Export analytics report in the specified format")
    public ResponseEntity<byte[]> exportReport(
            @RequestParam String timeRange,
            @RequestParam(defaultValue = "pdf") String format) {
        try {
            byte[] reportContent = analyticsService.exportReport(timeRange, format);

            HttpHeaders headers = new HttpHeaders();
            String contentType;
            String fileExtension;

            switch (format.toLowerCase()) {
                case "pdf":
                    contentType = MediaType.APPLICATION_PDF_VALUE;
                    fileExtension = "pdf";
                    break;
                case "excel":
                    contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    fileExtension = "xlsx";
                    break;
                case "csv":
                    contentType = "text/csv";
                    fileExtension = "csv";
                    break;
                default:
                    contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
                    fileExtension = "bin";
            }

            headers.setContentType(MediaType.parseMediaType(contentType));
            headers.setContentDispositionFormData("attachment",
                    "analytics-report-" + timeRange + "." + fileExtension);

            return new ResponseEntity<>(reportContent, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/email")
    @Operation(summary = "Email analytics report", description = "Send analytics report via email")
    public ResponseEntity<Map<String, String>> emailReport(
            @RequestParam String timeRange,
            @RequestParam String recipientEmail) {
        try {
            analyticsService.emailReport(timeRange, recipientEmail);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Report sent successfully to " + recipientEmail);
            response.put("status", "success");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to send report: " + e.getMessage());
            response.put("status", "error");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/generate")
    @Operation(summary = "Generate reports", description = "Manually trigger report generation")
    public ResponseEntity<Map<String, String>> generateReports() {
        try {
            analyticsService.generateAndStoreReports();

            Map<String, String> response = new HashMap<>();
            response.put("message", "Reports generated successfully");
            response.put("status", "success");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to generate reports: " + e.getMessage());
            response.put("status", "error");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/quick-reports/{type}")
    @Operation(summary = "Get quick report", description = "Get specific quick report types")
    public ResponseEntity<byte[]> getQuickReport(
            @PathVariable String type,
            @RequestParam(defaultValue = "pdf") String format) {
        try {
            // Map quick report types to time ranges
            String timeRange;
            switch (type.toLowerCase()) {
                case "sales":
                    timeRange = "monthly";
                    break;
                case "inventory":
                    timeRange = "weekly";
                    break;
                case "customer":
                    timeRange = "quarterly";
                    break;
                case "financial":
                    timeRange = "yearly";
                    break;
                default:
                    timeRange = "monthly";
            }

            return exportReport(timeRange, format);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}