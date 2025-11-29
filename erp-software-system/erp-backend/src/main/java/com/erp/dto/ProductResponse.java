package com.erp.dto;

import com.erp.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String sku;
    private String category;
    private String description;
    private BigDecimal price;
    private String unit;

    public static ProductResponse fromEntity(Product product) {
        if (product == null) return null;

        ProductResponse response = new ProductResponse();
        response.id = product.getId();
        response.name = product.getName();
        response.sku = product.getSku();
        response.category = product.getCategory();
        response.description = product.getDescription();
        response.price = product.getPrice();
        response.unit = product.getUnit();

        return response;
    }
}