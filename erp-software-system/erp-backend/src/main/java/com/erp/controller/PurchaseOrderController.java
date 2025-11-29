package com.erp.controller;

import com.erp.dto.PurchaseOrderDTO;
import com.erp.dto.StatusUpdateDTO;
import com.erp.entity.PurchaseOrder;
import com.erp.service.PurchaseOrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/purchase-orders")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Purchase Order Management", description = "APIs for managing purchase orders in the ERP system")
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderService purchaseOrderService;

    @GetMapping
    @Operation(summary = "Get all purchase orders", description = "Retrieve a list of all purchase orders")
    public ResponseEntity<List<PurchaseOrder>> getAllPurchaseOrders() {
        try {
            List<PurchaseOrder> purchaseOrders = purchaseOrderService.getAllPurchaseOrders();
            return ResponseEntity.ok(purchaseOrders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get purchase order by ID", description = "Retrieve a specific purchase order by its ID")
    public ResponseEntity<?> getPurchaseOrderById(@PathVariable Long id) {
        try {
            PurchaseOrder purchaseOrder = purchaseOrderService.getPurchaseOrderById(id);
            return ResponseEntity.ok(purchaseOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error retrieving purchase order"));
        }
    }

    @GetMapping("/number/{poNumber}")
    @Operation(summary = "Get purchase order by PO number", description = "Retrieve a specific purchase order by its PO number")
    public ResponseEntity<?> getPurchaseOrderByPoNumber(@PathVariable String poNumber) {
        try {
            PurchaseOrder purchaseOrder = purchaseOrderService.getPurchaseOrderByPoNumber(poNumber);
            return ResponseEntity.ok(purchaseOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error retrieving purchase order"));
        }
    }

    @PostMapping
    @Operation(summary = "Create a new purchase order", description = "Create a new purchase order in the system")
    public ResponseEntity<?> createPurchaseOrder(@Valid @RequestBody PurchaseOrderDTO purchaseOrderDTO,
                                                 BindingResult result) {
        try {
            if (result.hasErrors()) {
                return ResponseEntity.badRequest()
                        .body(createValidationErrorResponse(result));
            }

            PurchaseOrder createdOrder = purchaseOrderService.createPurchaseOrder(purchaseOrderDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error creating purchase order"));
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update purchase order", description = "Update an existing purchase order")
    public ResponseEntity<?> updatePurchaseOrder(@PathVariable Long id,
                                                 @Valid @RequestBody PurchaseOrderDTO purchaseOrderDTO,
                                                 BindingResult result) {
        try {
            if (result.hasErrors()) {
                return ResponseEntity.badRequest()
                        .body(createValidationErrorResponse(result));
            }

            PurchaseOrder updatedOrder = purchaseOrderService.updatePurchaseOrder(id, purchaseOrderDTO);
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
                    .body(createErrorResponse("Error updating purchase order"));
        }
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update purchase order status", description = "Update the status of a purchase order")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id,
                                               @Valid @RequestBody StatusUpdateDTO statusUpdateDTO,
                                               BindingResult result) {
        try {
            if (result.hasErrors()) {
                return ResponseEntity.badRequest()
                        .body(createValidationErrorResponse(result));
            }

            PurchaseOrder updatedOrder = purchaseOrderService.updateOrderStatus(id, statusUpdateDTO);
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
    @Operation(summary = "Delete purchase order", description = "Delete a purchase order by ID")
    public ResponseEntity<?> deletePurchaseOrder(@PathVariable Long id) {
        try {
            purchaseOrderService.deletePurchaseOrder(id);
            return ResponseEntity.ok().body(createSuccessResponse("Purchase order deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error deleting purchase order"));
        }
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get purchase orders by status", description = "Retrieve purchase orders filtered by status")
    public ResponseEntity<?> getPurchaseOrdersByStatus(@PathVariable String status) {
        try {
            List<PurchaseOrder> purchaseOrders = purchaseOrderService.getPurchaseOrdersByStatus(status);
            return ResponseEntity.ok(purchaseOrders);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error retrieving purchase orders"));
        }
    }

    @GetMapping("/supplier/{supplierId}")
    @Operation(summary = "Get purchase orders by supplier", description = "Retrieve purchase orders for a specific supplier")
    public ResponseEntity<List<PurchaseOrder>> getPurchaseOrdersBySupplier(@PathVariable Long supplierId) {
        try {
            List<PurchaseOrder> purchaseOrders = purchaseOrderService.getPurchaseOrdersBySupplier(supplierId);
            return ResponseEntity.ok(purchaseOrders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/overdue")
    @Operation(summary = "Get overdue purchase orders", description = "Retrieve purchase orders that are overdue")
    public ResponseEntity<List<PurchaseOrder>> getOverduePurchaseOrders() {
        try {
            List<PurchaseOrder> purchaseOrders = purchaseOrderService.getOverduePurchaseOrders();
            return ResponseEntity.ok(purchaseOrders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
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