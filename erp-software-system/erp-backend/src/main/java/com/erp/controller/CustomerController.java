package com.erp.controller;

import com.erp.dto.CustomerRequest;
import com.erp.dto.CustomerResponse;
import com.erp.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Customer Management", description = "APIs for managing customers in the ERP system")
@SecurityRequirement(name = "bearerAuth")
public class CustomerController {
    private static final Logger log = LoggerFactory.getLogger(CustomerController.class);

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService){
        this.customerService=customerService;
    }

    @Async("erpTaskExecutor")
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALES_EXECUTIVE')")
    @Operation(summary = "Get all customers", description = "Retrieve all customers with async processing")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Customers retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public CompletableFuture<ResponseEntity<List<CustomerResponse>>> getAllCustomers() {
        log.info("Received request to get all customers");
        return customerService.getAllCustomers()
                .thenApply(ResponseEntity::ok)
                .exceptionally(ex -> {
                    log.error("Error fetching customers: {}", ex.getMessage());
                    return ResponseEntity.internalServerError().build();
                });
    }

    @Async("erpTaskExecutor")
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALES_EXECUTIVE')")
    @Operation(summary = "Get customer by ID", description = "Retrieve a specific customer by their ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Customer found"),
            @ApiResponse(responseCode = "404", description = "Customer not found"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public CompletableFuture<ResponseEntity<CustomerResponse>> getCustomerById(
            @Parameter(description = "Customer ID", example = "1")
            @PathVariable Long id) {

        log.info("Received request to get customer by ID: {}", id);
        return customerService.getCustomerById(id)
                .thenApply(optionalCustomer ->
                        optionalCustomer.map(ResponseEntity::ok)
                                .orElse(ResponseEntity.notFound().build())
                )
                .exceptionally(ex -> {
                    log.error("Error fetching customer with ID {}: {}", id, ex.getMessage());
                    return ResponseEntity.internalServerError().build();
                });
    }

    @Async("erpTaskExecutor")
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALES_EXECUTIVE')")
    @Operation(summary = "Create new customer", description = "Create a new customer account")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Customer created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public CompletableFuture<ResponseEntity<CustomerResponse>> createCustomer(
            @Valid @RequestBody CustomerRequest customerRequest) {

        log.info("Received request to create new customer: {}", customerRequest.getEmail());
        return customerService.createCustomer(customerRequest)
                .thenApply(ResponseEntity::ok)
                .exceptionally(ex -> {
                    log.error("Error creating customer: {}", ex.getMessage());
                    return ResponseEntity.badRequest().build();
                });
    }

    @Async("erpTaskExecutor")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALES_EXECUTIVE')")
    @Operation(summary = "Update customer", description = "Update an existing customer's information")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Customer updated successfully"),
            @ApiResponse(responseCode = "404", description = "Customer not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public CompletableFuture<ResponseEntity<CustomerResponse>> updateCustomer(
            @Parameter(description = "Customer ID", example = "1")
            @PathVariable Long id,
            @Valid @RequestBody CustomerRequest customerRequest) {

        log.info("Received request to update customer with ID: {}", id);
        return customerService.updateCustomer(id, customerRequest)
                .thenApply(ResponseEntity::ok)
                .exceptionally(ex -> {
                    log.error("Error updating customer with ID {}: {}", id, ex.getMessage());
                    if (ex.getCause() instanceof RuntimeException) {
                        return ResponseEntity.badRequest().build();
                    }
                    return ResponseEntity.notFound().build();
                });
    }

    @Async("erpTaskExecutor")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete customer", description = "Delete a customer account")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Customer deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Customer not found"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public CompletableFuture<ResponseEntity<Void>> deleteCustomer(
            @Parameter(description = "Customer ID", example = "1")
            @PathVariable Long id) {

        log.info("Received request to delete customer with ID: {}", id);
        return customerService.deleteCustomer(id)
                .thenApply(v -> ResponseEntity.ok().<Void>build())
                .exceptionally(ex -> {
                    log.error("Error deleting customer with ID {}: {}", id, ex.getMessage());
                    return ResponseEntity.notFound().build();
                });
    }

    @Async("erpTaskExecutor")
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALES_EXECUTIVE')")
    @Operation(summary = "Search customers", description = "Search customers by name, email, or phone")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Search completed successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public CompletableFuture<ResponseEntity<List<CustomerResponse>>> searchCustomers(
            @Parameter(description = "Search query")
            @RequestParam String query) {

        log.info("Received search request with query: {}", query);
        return customerService.searchCustomers(query)
                .thenApply(ResponseEntity::ok)
                .exceptionally(ex -> {
                    log.error("Error searching customers: {}", ex.getMessage());
                    return ResponseEntity.internalServerError().build();
                });
    }

    @Async("erpTaskExecutor")
    @GetMapping("/type/{type}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALES_EXECUTIVE')")
    @Operation(summary = "Get customers by type", description = "Retrieve customers by their type (INDIVIDUAL or BUSINESS)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Customers retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid customer type"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public CompletableFuture<ResponseEntity<List<CustomerResponse>>> getCustomersByType(
            @Parameter(description = "Customer type", example = "BUSINESS")
            @PathVariable String type) {

        log.info("Received request to get customers by type: {}", type);
        return customerService.getCustomersByType(type)
                .thenApply(ResponseEntity::ok)
                .exceptionally(ex -> {
                    log.error("Error fetching customers by type {}: {}", type, ex.getMessage());
                    return ResponseEntity.badRequest().build();
                });
    }

    @Async("erpTaskExecutor")
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update customer status", description = "Update the status of a customer (ACTIVE, INACTIVE, BLOCKED)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Status updated successfully"),
            @ApiResponse(responseCode = "404", description = "Customer not found"),
            @ApiResponse(responseCode = "400", description = "Invalid status"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public CompletableFuture<ResponseEntity<CustomerResponse>> updateCustomerStatus(
            @Parameter(description = "Customer ID", example = "1")
            @PathVariable Long id,
            @Parameter(description = "New status", example = "ACTIVE")
            @RequestParam String status) {

        log.info("Received request to update status for customer ID: {} to {}", id, status);
        return customerService.updateCustomerStatus(id, status)
                .thenApply(ResponseEntity::ok)
                .exceptionally(ex -> {
                    log.error("Error updating customer status: {}", ex.getMessage());
                    if (ex.getCause() instanceof RuntimeException) {
                        return ResponseEntity.badRequest().build();
                    }
                    return ResponseEntity.notFound().build();
                });
    }

    @Async("erpTaskExecutor")
    @GetMapping("/stats/active-count")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALES_EXECUTIVE')")
    @Operation(summary = "Get active customers count", description = "Get the count of active customers")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Count retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public CompletableFuture<ResponseEntity<Long>> getActiveCustomersCount() {
        log.info("Received request to get active customers count");
        return customerService.getActiveCustomersCount()
                .thenApply(ResponseEntity::ok)
                .exceptionally(ex -> {
                    log.error("Error fetching active customers count: {}", ex.getMessage());
                    return ResponseEntity.internalServerError().build();
                });
    }
}