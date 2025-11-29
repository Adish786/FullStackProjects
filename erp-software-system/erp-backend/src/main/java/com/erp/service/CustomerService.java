package com.erp.service;

import com.erp.dto.CustomerRequest;
import com.erp.dto.CustomerResponse;
import com.erp.entity.Customer;
import com.erp.enums.CustomerStatus;
import com.erp.enums.CustomerType;
import com.erp.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    private static final Logger log = LoggerFactory.getLogger(CustomerService.class);
    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository=customerRepository;
    }

    @Async("erpTaskExecutor")
    @Transactional(readOnly = true)
    public CompletableFuture<List<CustomerResponse>> getAllCustomers() {
        log.info("Fetching all customers asynchronously");
        return CompletableFuture.supplyAsync(() -> {
            List<Customer> customers = customerRepository.findAll();
            return customers.stream()
                    .map(CustomerResponse::fromEntity)
                    .collect(Collectors.toList());
        });
    }

    @Async("erpTaskExecutor")
    @Transactional(readOnly = true)
    public CompletableFuture<Optional<CustomerResponse>> getCustomerById(Long id) {
        log.info("Fetching customer by ID: {} asynchronously", id);
        return CompletableFuture.supplyAsync(() ->
                customerRepository.findById(id)
                        .map(CustomerResponse::fromEntity)
        );
    }

    @Async("erpTaskExecutor")
    @Transactional
    public CompletableFuture<CustomerResponse> createCustomer(CustomerRequest request) {
        log.info("Creating new customer asynchronously: {}", request.getEmail());

        return CompletableFuture.supplyAsync(() -> {
            // Check if email already exists
            if (customerRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Customer with email " + request.getEmail() + " already exists");
            }

            // Check if GSTIN already exists (if provided)
            if (request.getGstin() != null && !request.getGstin().trim().isEmpty()) {
                if (customerRepository.existsByGstin(request.getGstin())) {
                    throw new RuntimeException("Customer with GSTIN " + request.getGstin() + " already exists");
                }
            }

            Customer customer = new Customer();
            mapRequestToEntity(request, customer);

            Customer savedCustomer = customerRepository.save(customer);
            log.info("Customer created successfully with ID: {}", savedCustomer.getId());
            return CustomerResponse.fromEntity(savedCustomer);
        });
    }

    @Async("erpTaskExecutor")
    @Transactional
    public CompletableFuture<CustomerResponse> updateCustomer(Long id, CustomerRequest request) {
        log.info("Updating customer with ID: {} asynchronously", id);

        return CompletableFuture.supplyAsync(() -> {
            Customer customer = customerRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + id));

            // Check if email is being changed and if it already exists
            if (!customer.getEmail().equals(request.getEmail()) &&
                    customerRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Customer with email " + request.getEmail() + " already exists");
            }

            // Check if GSTIN is being changed and if it already exists
            if (request.getGstin() != null && !request.getGstin().trim().isEmpty() &&
                    !request.getGstin().equals(customer.getGstin()) &&
                    customerRepository.existsByGstin(request.getGstin())) {
                throw new RuntimeException("Customer with GSTIN " + request.getGstin() + " already exists");
            }

            mapRequestToEntity(request, customer);
            Customer updatedCustomer = customerRepository.save(customer);
            log.info("Customer updated successfully with ID: {}", updatedCustomer.getId());
            return CustomerResponse.fromEntity(updatedCustomer);
        });
    }

    @Async("erpTaskExecutor")
    @Transactional
    public CompletableFuture<Void> deleteCustomer(Long id) {
        log.info("Deleting customer with ID: {} asynchronously", id);

        return CompletableFuture.supplyAsync(() -> {
            Customer customer = customerRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + id));

            customerRepository.delete(customer);
            log.info("Customer deleted successfully with ID: {}", id);
            return null;
        });
    }

    @Async("erpTaskExecutor")
    @Transactional(readOnly = true)
    public CompletableFuture<List<CustomerResponse>> searchCustomers(String query) {
        log.info("Searching customers with query: {} asynchronously", query);
        return CompletableFuture.supplyAsync(() -> {
            List<Customer> customers = customerRepository.searchCustomers(query);
            return customers.stream()
                    .map(CustomerResponse::fromEntity)
                    .collect(Collectors.toList());
        });
    }

    @Async("erpTaskExecutor")
    @Transactional(readOnly = true)
    public CompletableFuture<List<CustomerResponse>> getCustomersByType(String type) {
        log.info("Fetching customers by type: {} asynchronously", type);
        return CompletableFuture.supplyAsync(() -> {
            try {
                CustomerType customerType = CustomerType.valueOf(type.toUpperCase());
                List<Customer> customers = customerRepository.findByType(customerType);
                return customers.stream()
                        .map(CustomerResponse::fromEntity)
                        .collect(Collectors.toList());
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid customer type: " + type);
            }
        });
    }

    @Async("erpTaskExecutor")
    @Transactional
    public CompletableFuture<CustomerResponse> updateCustomerStatus(Long id, String status) {
        log.info("Updating customer status for ID: {} to {} asynchronously", id, status);

        return CompletableFuture.supplyAsync(() -> {
            Customer customer = customerRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + id));

            try {
                CustomerStatus customerStatus = CustomerStatus.valueOf(status.toUpperCase());
                customer.setStatus(customerStatus);
                Customer updatedCustomer = customerRepository.save(customer);
                log.info("Customer status updated successfully for ID: {}", id);
                return CustomerResponse.fromEntity(updatedCustomer);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid customer status: " + status);
            }
        });
    }

    @Async("erpTaskExecutor")
    @Transactional(readOnly = true)
    public CompletableFuture<Long> getActiveCustomersCount() {
        log.info("Fetching active customers count asynchronously");
        return CompletableFuture.supplyAsync(() ->
                customerRepository.countActiveCustomers()
        );
    }

    private void mapRequestToEntity(CustomerRequest request, Customer customer) {
        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setAddress(request.getAddress());
        customer.setGstin(request.getGstin());

        try {
            if (request.getType() != null) {
                customer.setType(CustomerType.valueOf(request.getType().toUpperCase()));
            }
            if (request.getStatus() != null) {
                customer.setStatus(CustomerStatus.valueOf(request.getStatus().toUpperCase()));
            }
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid customer type or status");
        }
    }

    @Transactional(readOnly = true)
    public Customer getCustomerEntityById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + id));
    }

}