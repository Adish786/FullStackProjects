package com.erp.service.impl;

import com.erp.dto.PurchaseOrderDTO;
import com.erp.dto.StatusUpdateDTO;
import com.erp.entity.Product;
import com.erp.entity.PurchaseOrder;
import com.erp.entity.Supplier;
import com.erp.enums.OrderStatus;
import com.erp.repository.PurchaseOrderRepository;
import com.erp.service.PurchaseOrderService;
import com.erp.service.ProductService;
import com.erp.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private SupplierService supplierService;

    @Autowired
    private ProductService productService;

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseOrder getPurchaseOrderById(Long id) {
        Optional<PurchaseOrder> purchaseOrder = purchaseOrderRepository.findById(id);
        if (purchaseOrder.isEmpty()) {
            throw new RuntimeException("Purchase order not found with id: " + id);
        }
        return purchaseOrder.get();
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseOrder getPurchaseOrderByPoNumber(String poNumber) {
        Optional<PurchaseOrder> purchaseOrder = purchaseOrderRepository.findByPoNumber(poNumber);
        if (purchaseOrder.isEmpty()) {
            throw new RuntimeException("Purchase order not found with PO number: " + poNumber);
        }
        return purchaseOrder.get();
    }

    @Override
    public PurchaseOrder createPurchaseOrder(PurchaseOrderDTO purchaseOrderDTO) {
        // Generate PO number
        String poNumber = generatePoNumber();

        // Validate supplier
        Supplier supplier = supplierService.getSupplierById(purchaseOrderDTO.getSupplierId());

        // Validate product
        Product product = productService.getProductById(purchaseOrderDTO.getProductId());

        // Create purchase order
        PurchaseOrder purchaseOrder = new PurchaseOrder();
        purchaseOrder.setPoNumber(poNumber);
        purchaseOrder.setSupplier(supplier);
        purchaseOrder.setProduct(product);
        purchaseOrder.setQuantity(purchaseOrderDTO.getQuantity());
        purchaseOrder.setUnitPrice(purchaseOrderDTO.getUnitPrice());
        purchaseOrder.setExpectedDelivery(purchaseOrderDTO.getExpectedDelivery());
        purchaseOrder.setNotes(purchaseOrderDTO.getNotes());
        purchaseOrder.setStatus(OrderStatus.ORDERED);

        return purchaseOrderRepository.save(purchaseOrder);
    }

    @Override
    public PurchaseOrder updatePurchaseOrder(Long id, PurchaseOrderDTO purchaseOrderDTO) {
        PurchaseOrder existingOrder = getPurchaseOrderById(id);

        if (!existingOrder.canBeUpdated()) {
            throw new RuntimeException("Cannot update purchase order with status: " + existingOrder.getStatus());
        }

        // Update fields
        if (!existingOrder.getSupplier().getId().equals(purchaseOrderDTO.getSupplierId())) {
            Supplier supplier = supplierService.getSupplierById(purchaseOrderDTO.getSupplierId());
            existingOrder.setSupplier(supplier);
        }

        if (!existingOrder.getProduct().getId().equals(purchaseOrderDTO.getProductId())) {
            Product product = productService.getProductById(purchaseOrderDTO.getProductId());
            existingOrder.setProduct(product);
        }

        existingOrder.setQuantity(purchaseOrderDTO.getQuantity());
        existingOrder.setUnitPrice(purchaseOrderDTO.getUnitPrice());
        existingOrder.setExpectedDelivery(purchaseOrderDTO.getExpectedDelivery());
        existingOrder.setNotes(purchaseOrderDTO.getNotes());

        return purchaseOrderRepository.save(existingOrder);
    }

    @Override
    public void deletePurchaseOrder(Long id) {
        PurchaseOrder purchaseOrder = getPurchaseOrderById(id);

        if (!purchaseOrder.canBeCancelled()) {
            throw new RuntimeException("Cannot delete purchase order with status: " + purchaseOrder.getStatus());
        }

        purchaseOrderRepository.delete(purchaseOrder);
    }

    @Override
    public PurchaseOrder updateOrderStatus(Long id, StatusUpdateDTO statusUpdateDTO) {
        PurchaseOrder purchaseOrder = getPurchaseOrderById(id);

        // Validate status transition
        validateStatusTransition(purchaseOrder.getStatus(), statusUpdateDTO.getStatus());

        purchaseOrder.setStatus(statusUpdateDTO.getStatus());

        // If status is RECEIVED, update product stock
        if (statusUpdateDTO.getStatus() == OrderStatus.RECEIVED) {
            updateProductStock(purchaseOrder);
        }

        return purchaseOrderRepository.save(purchaseOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseOrder> getPurchaseOrdersByStatus(String status) {
        try {
            OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
            return purchaseOrderRepository.findByStatus(orderStatus);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseOrder> getPurchaseOrdersBySupplier(Long supplierId) {
        return purchaseOrderRepository.findBySupplierId(supplierId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseOrder> getOverduePurchaseOrders() {
        return purchaseOrderRepository.findOverdueOrders();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByPoNumber(String poNumber) {
        return purchaseOrderRepository.existsByPoNumber(poNumber);
    }

    @Override
    public String generatePoNumber() {
        String baseNumber = "PO-" + Year.now().getValue() + "-";
        Long lastNumber = purchaseOrderRepository.count();

        String poNumber;
        int attempt = 0;
        do {
            poNumber = baseNumber + String.format("%03d", lastNumber + 1 + attempt);
            attempt++;
        } while (existsByPoNumber(poNumber) && attempt < 1000);

        return poNumber;
    }

    private void validateStatusTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        // Define allowed status transitions
        switch (currentStatus) {
            case ORDERED:
                if (newStatus == OrderStatus.CANCELLED) return;
                break;
            case DISPATCHED:
                if (newStatus == OrderStatus.RECEIVED || newStatus == OrderStatus.PARTIAL) return;
                break;
            case PARTIAL:
                if (newStatus == OrderStatus.RECEIVED) return;
                break;
            case RECEIVED:
            case CANCELLED:
                throw new RuntimeException("Cannot change status from " + currentStatus);
        }

        if (currentStatus == newStatus) {
            throw new RuntimeException("Purchase order is already in status: " + currentStatus);
        }

        throw new RuntimeException("Invalid status transition from " + currentStatus + " to " + newStatus);
    }

    private void updateProductStock(PurchaseOrder purchaseOrder) {
        Product product = purchaseOrder.getProduct();
        Integer newStock = product.getCurrentStock() + purchaseOrder.getQuantity();
        product.setCurrentStock(newStock);
        // Note: In a real application, you would call productService.updateProduct()
    }
}