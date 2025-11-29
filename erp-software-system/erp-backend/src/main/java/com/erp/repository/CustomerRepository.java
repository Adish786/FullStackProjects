package com.erp.repository;

import com.erp.entity.Customer;
import com.erp.enums.CustomerStatus;
import com.erp.enums.CustomerType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    // Remove @Async from basic repository methods - let service handle async
    Optional<Customer> findByEmail(String email);
    Optional<Customer> findByGstin(String gstin);
    boolean existsByEmail(String email);
    boolean existsByGstin(String gstin);

    // Async methods with custom queries
    @Async
    @Query("SELECT c FROM Customer c WHERE c.id = :id")
    CompletableFuture<Optional<Customer>> findByIdAsync(@Param("id") Long id);

    @Async
    @Query("SELECT c FROM Customer c WHERE c.status = :status")
    CompletableFuture<List<Customer>> findByStatusAsync(@Param("status") CustomerStatus status);

    @Async
    @Query("SELECT c FROM Customer c WHERE " +
            "LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "c.phone LIKE CONCAT('%', :query, '%')")
    CompletableFuture<List<Customer>> searchCustomersAsync(@Param("query") String query);

    @Async
    @Query("SELECT c FROM Customer c WHERE c.type = :type")
    CompletableFuture<List<Customer>> findByTypeAsync(@Param("type") CustomerType type);

    @Async
    @Query("SELECT COUNT(c) FROM Customer c WHERE c.status = 'ACTIVE'")
    CompletableFuture<Long> countActiveCustomersAsync();

    Page<Customer> findByStatus(CustomerStatus status, Pageable pageable);

    @Query("SELECT c FROM Customer c WHERE c.type = :type")
    List<Customer> findByType(@Param("type") CustomerType type);

    @Query("SELECT COUNT(c) FROM Customer c WHERE c.status = 'ACTIVE'")
    Long countActiveCustomers();

    @Query("SELECT c FROM Customer c WHERE " +
            "LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.phone) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.gstin) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Customer> searchCustomers(@Param("query") String query);
    List<Customer> findByNameContainingIgnoreCase(String name);

    List<Customer> findByCompanyContainingIgnoreCase(String company);

    boolean existsByEmailAndIdNot(String email, Long id);

}