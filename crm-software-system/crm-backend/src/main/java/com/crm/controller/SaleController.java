package com.crm.controller;


import com.crm.model.Sale;
import com.crm.service.SaleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/sales")
@Tag(name = "Sales Controller", description = "Handles Sale CRUD operations in multi-threaded mode")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @PostMapping
    public CompletableFuture<ResponseEntity<Sale>> createSale(@RequestBody Sale sale) {
        return saleService.createSale(sale)
                .thenApply(ResponseEntity::ok);
    }

    @GetMapping
    public CompletableFuture<ResponseEntity<List<Sale>>> getAllSales() {
        return saleService.getAllSales()
                .thenApply(ResponseEntity::ok);
    }

    @GetMapping("/{id}")
    public CompletableFuture<ResponseEntity<Sale>> getSaleById(@PathVariable Long id) {
        return saleService.getSaleById(id)
                .thenApply(ResponseEntity::ok);
    }

    @PutMapping("/{id}")
    public CompletableFuture<ResponseEntity<Sale>> updateSale(
            @PathVariable Long id,
            @RequestBody Sale sale) {

        return saleService.updateSale(id, sale)
                .thenApply(ResponseEntity::ok);
    }

    @DeleteMapping("/{id}")
    public CompletableFuture<ResponseEntity<String>> deleteSale(@PathVariable Long id) {
        return saleService.deleteSale(id)
                .thenApply(v -> ResponseEntity.ok("Sale deleted successfully"));
    }
}

