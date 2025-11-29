package com.user.service;

import com.user.entity.Fee;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface FeeService {

    CompletableFuture<Fee> createFee(Fee fee);

    CompletableFuture<Fee> updateFee(Long id, Fee fee);

    Fee getFeeById(Long id);

    List<Fee> getAllFees();

    List<Fee> getFeesByStudentId(Long studentId);

    void deleteFee(Long id);
}
