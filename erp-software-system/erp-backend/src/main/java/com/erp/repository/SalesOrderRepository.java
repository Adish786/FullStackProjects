package com.erp.repository;

import com.erp.entity.SalesOrder;
import com.erp.enums.SalesOrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {

    Optional<SalesOrder> findByOrderNumber(String orderNumber);

    List<SalesOrder> findByCustomerId(Long customerId);

    List<SalesOrder> findByStatus(SalesOrderStatus status);

    Page<SalesOrder> findByStatus(SalesOrderStatus status, Pageable pageable);

    Page<SalesOrder> findByCustomerId(Long customerId, Pageable pageable);

    List<SalesOrder> findByOrderDateBetween(LocalDate startDate, LocalDate endDate);

    Page<SalesOrder> findByOrderDateBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);

    @Query("SELECT so FROM SalesOrder so WHERE so.orderDate BETWEEN :startDate AND :endDate AND so.status = :status")
    Page<SalesOrder> findByDateRangeAndStatus(@Param("startDate") LocalDate startDate,
                                              @Param("endDate") LocalDate endDate,
                                              @Param("status") SalesOrderStatus status,
                                              Pageable pageable);

    boolean existsByOrderNumber(String orderNumber);

    @Query("SELECT COUNT(so) FROM SalesOrder so WHERE so.status = :status")
    Long countByStatus(@Param("status") SalesOrderStatus status);

    @Query("SELECT SUM(so.totalAmount) FROM SalesOrder so WHERE so.orderDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalRevenueByDateRange(@Param("startDate") LocalDate startDate,
                                          @Param("endDate") LocalDate endDate);

    Page<SalesOrder> findByStatusAndCustomerId(
            SalesOrderStatus status,
            Long customerId,
            Pageable pageable
    );

}