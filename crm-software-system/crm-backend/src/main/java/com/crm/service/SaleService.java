package com.crm.service;


import com.crm.model.Sale;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface SaleService {

    CompletableFuture<Sale> createSale(Sale sale);

    CompletableFuture<List<Sale>> getAllSales();

    CompletableFuture<Sale> updateSale(Long id, Sale sale);

    CompletableFuture<Void> deleteSale(Long id);

    CompletableFuture<Sale> getSaleById(Long id);
}

