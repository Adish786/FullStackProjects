package com.erp.service.impl;

import com.erp.dto.SalesOrderDTO;
import com.erp.dto.SalesOrderItemDTO;
import com.erp.dto.StatusUpdateDTO;
import com.erp.entity.*;
import com.erp.enums.SalesOrderStatus;
import com.erp.repository.SalesOrderRepository;
import com.erp.service.SalesOrderService;
import com.erp.service.CustomerService;
import com.erp.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SalesOrderServiceImpl implements SalesOrderService {

    @Autowired
    private SalesOrderRepository salesOrderRepository;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private ProductService productService;

    @Override
    @Transactional(readOnly = true)
    public Page<SalesOrder> getAllSalesOrders(Pageable pageable) {
        return salesOrderRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public SalesOrder getSalesOrderById(Long id) {
        Optional<SalesOrder> salesOrder = salesOrderRepository.findById(id);
        if (salesOrder.isEmpty()) {
            throw new RuntimeException("Sales order not found with id: " + id);
        }
        return salesOrder.get();
    }

    @Override
    @Transactional(readOnly = true)
    public SalesOrder getSalesOrderByOrderNumber(String orderNumber) {
        Optional<SalesOrder> salesOrder = salesOrderRepository.findByOrderNumber(orderNumber);
        if (salesOrder.isEmpty()) {
            throw new RuntimeException("Sales order not found with order number: " + orderNumber);
        }
        return salesOrder.get();
    }

    @Override
    public SalesOrder createSalesOrder(SalesOrderDTO salesOrderDTO) {
        // Generate order number
        String orderNumber = generateOrderNumber();

        // Validate customer
        Customer customer = customerService.getCustomerEntityById(salesOrderDTO.getCustomerId());
        // Create sales order
        SalesOrder salesOrder = new SalesOrder();
        salesOrder.setOrderNumber(orderNumber);
        salesOrder.setCustomer(customer);
        salesOrder.setShippingAddress(salesOrderDTO.getShippingAddress());
        salesOrder.setBillingAddress(salesOrderDTO.getBillingAddress());
        salesOrder.setPaymentMethod(salesOrderDTO.getPaymentMethod());
        salesOrder.setNotes(salesOrderDTO.getNotes());
        salesOrder.setStatus(SalesOrderStatus.PENDING);

        // Add items
        for (SalesOrderItemDTO itemDTO : salesOrderDTO.getItems()) {
            Product product = productService.getProductById(itemDTO.getProductId());

            SalesOrderItem item = new SalesOrderItem();
            item.setProduct(product);
            item.setQuantity(itemDTO.getQuantity());
            item.setUnitPrice(itemDTO.getUnitPrice());

            salesOrder.addItem(item);
        }

        // Check stock availability
        checkStockAvailability(salesOrder);

        return salesOrderRepository.save(salesOrder);
    }

    @Override
    public SalesOrder updateSalesOrder(Long id, SalesOrderDTO salesOrderDTO) {
        SalesOrder existingOrder = getSalesOrderById(id);

        if (!existingOrder.canBeUpdated()) {
            throw new RuntimeException("Cannot update sales order with status: " + existingOrder.getStatus());
        }

        // Update customer if changed
        if (!existingOrder.getCustomer().getId().equals(salesOrderDTO.getCustomerId())) {
            Customer customer = customerService.getCustomerEntityById(salesOrderDTO.getCustomerId());
            existingOrder.setCustomer(customer);
        }

        existingOrder.setShippingAddress(salesOrderDTO.getShippingAddress());
        existingOrder.setBillingAddress(salesOrderDTO.getBillingAddress());
        existingOrder.setPaymentMethod(salesOrderDTO.getPaymentMethod());
        existingOrder.setNotes(salesOrderDTO.getNotes());

        // Update items
        existingOrder.getItems().clear();
        for (SalesOrderItemDTO itemDTO : salesOrderDTO.getItems()) {
            Product product = productService.getProductById(itemDTO.getProductId());

            SalesOrderItem item = new SalesOrderItem();
            item.setProduct(product);
            item.setQuantity(itemDTO.getQuantity());
            item.setUnitPrice(itemDTO.getUnitPrice());

            existingOrder.addItem(item);
        }

        // Check stock availability
        checkStockAvailability(existingOrder);

        return salesOrderRepository.save(existingOrder);
    }

    @Override
    public void deleteSalesOrder(Long id) {
        SalesOrder salesOrder = getSalesOrderById(id);

        if (!salesOrder.canBeCancelled()) {
            throw new RuntimeException("Cannot delete sales order with status: " + salesOrder.getStatus());
        }

        salesOrderRepository.delete(salesOrder);
    }

    @Override
    public SalesOrder updateOrderStatus(Long id, StatusUpdateDTO statusUpdateDTO) {
        SalesOrder salesOrder = getSalesOrderById(id);

        // Validate status transition
        SalesOrderStatus newStatus = validateStatusTransition(salesOrder.getStatus(), statusUpdateDTO.getStatus().toString());

        salesOrder.setStatus(newStatus);

        // If status is DISPATCHED, update product stock
        if (newStatus == SalesOrderStatus.DISPATCHED) {
            updateProductStock(salesOrder);
        }

        return salesOrderRepository.save(salesOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SalesOrder> getSalesOrdersByStatus(String status, Pageable pageable) {
        try {
            SalesOrderStatus orderStatus = SalesOrderStatus.valueOf(status.toUpperCase());
            return salesOrderRepository.findByStatus(orderStatus, pageable);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SalesOrder> getSalesOrdersByCustomer(Long customerId, Pageable pageable) {
        return salesOrderRepository.findByCustomerId(customerId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SalesOrder> getSalesOrdersByDateRange(String startDate, String endDate, Pageable pageable) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        return salesOrderRepository.findByOrderDateBetween(start, end, pageable);
    }

    @Override
    public String generateOrderNumber() {
        String baseNumber = "SO-" + Year.now().getValue() + "-";
        Long lastNumber = salesOrderRepository.count();

        String orderNumber;
        int attempt = 0;
        do {
            orderNumber = baseNumber + String.format("%03d", lastNumber + 1 + attempt);
            attempt++;
        } while (existsByOrderNumber(orderNumber) && attempt < 1000);

        return orderNumber;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByOrderNumber(String orderNumber) {
        return salesOrderRepository.existsByOrderNumber(orderNumber);
    }

    private void checkStockAvailability(SalesOrder salesOrder) {
        for (SalesOrderItem item : salesOrder.getItems()) {
            Product product = item.getProduct();
            if (product.getCurrentStock() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName() +
                        ". Available: " + product.getCurrentStock() +
                        ", Requested: " + item.getQuantity());
            }
        }
    }

    private void updateProductStock(SalesOrder salesOrder) {
        for (SalesOrderItem item : salesOrder.getItems()) {
            Product product = item.getProduct();
            Integer newStock = product.getCurrentStock() - item.getQuantity();
            product.setCurrentStock(newStock);
            // Note: In a real application, you would call productService.updateProduct()
        }
    }

    private SalesOrderStatus validateStatusTransition(SalesOrderStatus currentStatus, String newStatusStr) {
        SalesOrderStatus newStatus;
        try {
            newStatus = SalesOrderStatus.valueOf(newStatusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + newStatusStr);
        }

        // Define allowed status transitions
        switch (currentStatus) {
            case PENDING:
                if (newStatus == SalesOrderStatus.APPROVED || newStatus == SalesOrderStatus.CANCELLED) return newStatus;
                break;
            case APPROVED:
                if (newStatus == SalesOrderStatus.DISPATCHED || newStatus == SalesOrderStatus.CANCELLED) return newStatus;
                break;
            case DISPATCHED:
                if (newStatus == SalesOrderStatus.DELIVERED) return newStatus;
                break;
            case DELIVERED:
            case CANCELLED:
                throw new RuntimeException("Cannot change status from " + currentStatus);
        }

        if (currentStatus == newStatus) {
            throw new RuntimeException("Sales order is already in status: " + currentStatus);
        }

        throw new RuntimeException("Invalid status transition from " + currentStatus + " to " + newStatus);
    }

    @Override
    public Page<SalesOrder> getSalesOrdersByStatusAndCustomer(
            SalesOrderStatus status,
            Long customerId,
            Pageable pageable) {

        return salesOrderRepository.findByStatusAndCustomerId(status, customerId, pageable);
    }

}