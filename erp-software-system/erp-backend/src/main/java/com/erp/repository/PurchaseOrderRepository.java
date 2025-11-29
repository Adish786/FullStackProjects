package com.erp.repository;

import com.erp.entity.PurchaseOrder;
import com.erp.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

    Optional<PurchaseOrder> findByPoNumber(String poNumber);

    List<PurchaseOrder> findBySupplierId(Long supplierId);

    List<PurchaseOrder> findByProductId(Long productId);

    List<PurchaseOrder> findByStatus(OrderStatus status);

    List<PurchaseOrder> findByOrderDateBetween(LocalDate startDate, LocalDate endDate);

    List<PurchaseOrder> findByExpectedDeliveryBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT po FROM PurchaseOrder po WHERE po.expectedDelivery < CURRENT_DATE AND po.status NOT IN ('RECEIVED', 'CANCELLED')")
    List<PurchaseOrder> findOverdueOrders();

    boolean existsByPoNumber(String poNumber);

    boolean existsByPoNumberAndIdNot(String poNumber, Long id);
}