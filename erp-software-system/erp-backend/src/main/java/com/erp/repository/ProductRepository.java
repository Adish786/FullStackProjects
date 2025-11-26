package com.erp.repository;


import com.erp.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySku(String sku);
    List<Product> findByCurrentStockLessThanEqual(Integer reorderLevel);
    boolean existsBySku(String sku);
}
