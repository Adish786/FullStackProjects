package com.erp.service;

import com.erp.entity.Product;
import java.util.List;

public interface ProductService {

    List<Product> getAllProducts();

    Product getProductById(Long id);

    Product createProduct(Product product);

    Product updateProduct(Long id, Product product);

    void deleteProduct(Long id);

    List<Product> getProductsByCategory(String category);

    List<Product> searchProducts(String searchTerm);

    List<Product> getLowStockProducts();

    boolean existsBySku(String sku);

    boolean existsBySkuAndIdNot(String sku, Long id);
}