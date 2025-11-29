package com.erp.service;

import com.erp.dto.SalesOrderDTO;
import com.erp.dto.StatusUpdateDTO;
import com.erp.entity.SalesOrder;
import com.erp.enums.SalesOrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface SalesOrderService {

    Page<SalesOrder> getAllSalesOrders(Pageable pageable);

    SalesOrder getSalesOrderById(Long id);

    SalesOrder getSalesOrderByOrderNumber(String orderNumber);

    SalesOrder createSalesOrder(SalesOrderDTO salesOrderDTO);

    SalesOrder updateSalesOrder(Long id, SalesOrderDTO salesOrderDTO);

    void deleteSalesOrder(Long id);

    SalesOrder updateOrderStatus(Long id, StatusUpdateDTO statusUpdateDTO);

    Page<SalesOrder> getSalesOrdersByStatus(String status, Pageable pageable);

    Page<SalesOrder> getSalesOrdersByCustomer(Long customerId, Pageable pageable);

    Page<SalesOrder> getSalesOrdersByDateRange(String startDate, String endDate, Pageable pageable);

    String generateOrderNumber();

    boolean existsByOrderNumber(String orderNumber);

    Page<SalesOrder> getSalesOrdersByStatusAndCustomer(SalesOrderStatus status, Long customerId, Pageable pageable);
}