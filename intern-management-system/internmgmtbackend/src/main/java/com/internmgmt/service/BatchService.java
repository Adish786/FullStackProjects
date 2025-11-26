package com.internmgmt.service;


import com.internmgmt.model.Batch;
import com.internmgmt.repository.BatchRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class BatchService {
    private final BatchRepository batchRepository;

    public BatchService(BatchRepository batchRepository) {
        this.batchRepository = batchRepository;
    }

    public Batch createBatch(LocalDate startDate) {
        Batch batch = new Batch();
        batch.setStartDate(startDate);
        batch.setEndDate(startDate.plusMonths(6));
        return batchRepository.save(batch);
    }

    public List<Batch> getAllBatches() {
        return batchRepository.findAll();
    }

    public Batch getBatchById(Long id) {
        return batchRepository.findById(id).orElse(null);
    }
}
