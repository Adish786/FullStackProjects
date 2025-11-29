package com.erp.controller;

import com.erp.dto.SalesOrderDTO;
import com.erp.dto.StatusUpdateDTO;
import com.erp.entity.SalesOrder;
import com.erp.service.SalesOrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/sales-orders")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Sales Order Management", description = "APIs for managing sales orders in the ERP system")
public class SalesOrderController {

    @Autowired
    private SalesOrderService salesOrderService;

    @GetMapping
    @Operation(summary = "Get all sales orders", description = "Retrieve a paginated list of all sales orders")
    public ResponseEntity<Map<String, Object>> getAllSalesOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "orderDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long customerId) {

        try {
            Pageable pageable = PageRequest.of(page, size,
                    Sort.by(Sort.Direction.fromString(sortDirection), sortBy));

            Page<SalesOrder> salesOrdersPage;

            if (status != null && customerId != null) {
                salesOrdersPage = salesOrderService.getSalesOrdersByStatus(status, pageable);
                salesOrdersPage = (Page<SalesOrder>) salesOrdersPage.filter(so -> so.getCustomer().getId().equals(customerId));
            }
            else if (status != null) {
                salesOrdersPage = salesOrderService.getSalesOrdersByStatus(status, pageable);
            } else if (customerId != null) {
                salesOrdersPage = salesOrderService.getSalesOrdersByCustomer(customerId, pageable);
            } else {
                salesOrdersPage = salesOrderService.getAllSalesOrders(pageable);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("salesOrders", salesOrdersPage.getContent());
            response.put("currentPage", salesOrdersPage.getNumber());
            response.put("totalItems", salesOrdersPage.getTotalElements());
            response.put("totalPages", salesOrdersPage.getTotalPages());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error retrieving sales orders: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get sales order by ID", description = "Retrieve a specific sales order by its ID")
    public ResponseEntity<?> getSalesOrderById(@PathVariable Long id) {
        try {
            SalesOrder salesOrder = salesOrderService.getSalesOrderById(id);
            return ResponseEntity.ok(salesOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error retrieving sales order"));
        }
    }

    @GetMapping("/number/{orderNumber}")
    @Operation(summary = "Get sales order by order number", description = "Retrieve a specific sales order by its order number")
    public ResponseEntity<?> getSalesOrderByOrderNumber(@PathVariable String orderNumber) {
        try {
            SalesOrder salesOrder = salesOrderService.getSalesOrderByOrderNumber(orderNumber);
            return ResponseEntity.ok(salesOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error retrieving sales order"));
        }
    }

    @PostMapping
    @Operation(summary = "Create a new sales order", description = "Create a new sales order in the system")
    public ResponseEntity<?> createSalesOrder(@Valid @RequestBody SalesOrderDTO salesOrderDTO,
                                              BindingResult result) {
        try {
            if (result.hasErrors()) {
                return ResponseEntity.badRequest()
                        .body(createValidationErrorResponse(result));
            }

            SalesOrder createdOrder = salesOrderService.createSalesOrder(salesOrderDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error creating sales order"));
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update sales order", description = "Update an existing sales order")
    public ResponseEntity<?> updateSalesOrder(@PathVariable Long id,
                                              @Valid @RequestBody SalesOrderDTO salesOrderDTO,
                                              BindingResult result) {
        try {
            if (result.hasErrors()) {
                return ResponseEntity.badRequest()
                        .body(createValidationErrorResponse(result));
            }

            SalesOrder updatedOrder = salesOrderService.updateSalesOrder(id, salesOrderDTO);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse(e.getMessage()));
            }
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error updating sales order"));
        }
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update sales order status", description = "Update the status of a sales order")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id,
                                               @Valid @RequestBody StatusUpdateDTO statusUpdateDTO,
                                               BindingResult result) {
        try {
            if (result.hasErrors()) {
                return ResponseEntity.badRequest()
                        .body(createValidationErrorResponse(result));
            }

            SalesOrder updatedOrder = salesOrderService.updateOrderStatus(id, statusUpdateDTO);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse(e.getMessage()));
            }
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error updating order status"));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete sales order", description = "Delete a sales order by ID")
    public ResponseEntity<?> deleteSalesOrder(@PathVariable Long id) {
        try {
            salesOrderService.deleteSalesOrder(id);
            return ResponseEntity.ok().body(createSuccessResponse("Sales order deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error deleting sales order"));
        }
    }

    // Helper methods for response formatting
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    private Map<String, Object> createSuccessResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    private Map<String, Object> createValidationErrorResponse(BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "Validation failed");
        response.put("errors", result.getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .toList());
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
}