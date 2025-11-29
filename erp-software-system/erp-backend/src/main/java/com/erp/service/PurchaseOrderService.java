package com.erp.service;

import com.erp.dto.PurchaseOrderDTO;
import com.erp.dto.StatusUpdateDTO;
import com.erp.entity.PurchaseOrder;
import java.util.List;

public interface PurchaseOrderService {

    List<PurchaseOrder> getAllPurchaseOrders();

    PurchaseOrder getPurchaseOrderById(Long id);

    PurchaseOrder getPurchaseOrderByPoNumber(String poNumber);

    PurchaseOrder createPurchaseOrder(PurchaseOrderDTO purchaseOrderDTO);

    PurchaseOrder updatePurchaseOrder(Long id, PurchaseOrderDTO purchaseOrderDTO);

    void deletePurchaseOrder(Long id);

    PurchaseOrder updateOrderStatus(Long id, StatusUpdateDTO statusUpdateDTO);

    List<PurchaseOrder> getPurchaseOrdersByStatus(String status);

    List<PurchaseOrder> getPurchaseOrdersBySupplier(Long supplierId);

    List<PurchaseOrder> getOverduePurchaseOrders();

    boolean existsByPoNumber(String poNumber);

    String generatePoNumber();
}