package com.erp.service.impl;

import com.erp.entity.Product;
import com.erp.repository.ProductRepository;
import com.erp.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {


    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository=productRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Product getProductById(Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isEmpty()) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        return product.get();
    }

    @Override
    public Product createProduct(Product product) {
        // Check if SKU already exists
        if (productRepository.existsBySku(product.getSku())) {
            throw new RuntimeException("Product with SKU '" + product.getSku() + "' already exists");
        }

        // Set default values if not provided
        if (product.getCurrentStock() == null) {
            product.setCurrentStock(0);
        }
        if (product.getReorderLevel() == null) {
            product.setReorderLevel(10);
        }

        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Long id, Product productDetails) {
        Product existingProduct = getProductById(id);

        // Check if SKU is being changed and if it conflicts with another product
        if (!existingProduct.getSku().equals(productDetails.getSku()) &&
                productRepository.existsBySkuAndIdNot(productDetails.getSku(), id)) {
            throw new RuntimeException("Product with SKU '" + productDetails.getSku() + "' already exists");
        }

        // Update fields
        existingProduct.setName(productDetails.getName());
        existingProduct.setSku(productDetails.getSku());
        existingProduct.setCategory(productDetails.getCategory());
        existingProduct.setPrice(productDetails.getPrice());
        existingProduct.setCurrentStock(productDetails.getCurrentStock());
        existingProduct.setReorderLevel(productDetails.getReorderLevel());
        existingProduct.setDescription(productDetails.getDescription());
        existingProduct.setUnit(productDetails.getUnit());

        return productRepository.save(existingProduct);
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> searchProducts(String searchTerm) {
        return productRepository.findByNameContainingIgnoreCase(searchTerm);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getLowStockProducts() {
        return productRepository.findLowStockProducts();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsBySku(String sku) {
        return productRepository.existsBySku(sku);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsBySkuAndIdNot(String sku, Long id) {
        return productRepository.existsBySkuAndIdNot(sku, id);
    }
}