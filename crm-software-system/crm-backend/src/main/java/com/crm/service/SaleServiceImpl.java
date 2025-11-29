package com.crm.service;


import com.crm.model.Sale;
import com.crm.repository.SaleRepository;
import com.crm.service.SaleService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@Transactional
public class SaleServiceImpl implements SaleService {

    private final SaleRepository saleRepository;

    public SaleServiceImpl(SaleRepository saleRepository) {
        this.saleRepository = saleRepository;
    }

    @Override
   // @Async("saleExecutor")
    @Async
    public CompletableFuture<Sale> createSale(Sale sale) {
        Sale savedSale = saleRepository.save(sale);
        return CompletableFuture.completedFuture(savedSale);
    }

    @Override
 //   @Async("saleExecutor")
    @Async
    public CompletableFuture<List<Sale>> getAllSales() {
        List<Sale> sales = saleRepository.findAll();
        return CompletableFuture.completedFuture(sales);
    }

    @Override
  //  @Async("saleExecutor")
    @Async
    public CompletableFuture<Sale> getSaleById(Long id) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale not found with id " + id));

        return CompletableFuture.completedFuture(sale);
    }

    @Override
 //   @Async("saleExecutor")
    @Async
    public CompletableFuture<Sale> updateSale(Long id, Sale updatedSale) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale not found with id " + id));

        sale.setAmount(updatedSale.getAmount());
        sale.setStatus(updatedSale.getStatus());
        sale.setCustomer(updatedSale.getCustomer());
        sale.setAssignedSalesRep(updatedSale.getAssignedSalesRep());
        sale.setDate(updatedSale.getDate());

        Sale savedSale = saleRepository.save(sale);

        return CompletableFuture.completedFuture(savedSale);
    }

    @Override
    @Async
   // @Async("saleExecutor")
    public CompletableFuture<Void> deleteSale(Long id) {
        saleRepository.deleteById(id);
        return CompletableFuture.completedFuture(null);
    }
}

