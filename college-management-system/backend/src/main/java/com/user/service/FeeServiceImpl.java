package com.user.service.impl;

import com.user.entity.Fee;
import com.user.repository.FeeRepository;
import com.user.service.FeeService;
import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.locks.ReentrantLock;

@Service
public class FeeServiceImpl implements FeeService {

    private final FeeRepository feeRepository;
    private final ReentrantLock lock = new ReentrantLock();

    public FeeServiceImpl(FeeRepository feeRepository) {
        this.feeRepository = feeRepository;
    }

    @Async
    @Transactional
    @Override
    public CompletableFuture<Fee> createFee(Fee fee) {
        lock.lock();
        try {
            fee.setDueAmount(fee.getTotalAmount().subtract(fee.getPaidAmount()));
            return CompletableFuture.completedFuture(feeRepository.save(fee));
        } finally {
            lock.unlock();
        }
    }

    @Async
    @Transactional
    @Override
    public CompletableFuture<Fee> updateFee(Long id, Fee fee) {
        lock.lock();
        try {
            Fee existing = feeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Fee not found"));

            existing.setTotalAmount(fee.getTotalAmount());
            existing.setPaidAmount(fee.getPaidAmount());
            existing.setDueAmount(fee.getTotalAmount().subtract(fee.getPaidAmount()));
            existing.setPaymentStatus(fee.getPaymentStatus());
            existing.setPaymentDates(fee.getPaymentDates());

            return CompletableFuture.completedFuture(feeRepository.save(existing));
        } finally {
            lock.unlock();
        }
    }

    @Override
    public Fee getFeeById(Long id) {
        return feeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fee not found"));
    }

    @Override
    public List<Fee> getAllFees() {
        return feeRepository.findAll();
    }

    @Override
    public List<Fee> getFeesByStudentId(Long studentId) {
        return feeRepository.findByStudentId(studentId);
    }

    @Override
    public void deleteFee(Long id) {
        feeRepository.deleteById(id);
    }
}
