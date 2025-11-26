package com.user.repository;

import com.user.entity.Fee;
import com.user.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface FeeRepository extends JpaRepository<Fee, Long> {
    Optional<Fee> findByStudentId(Long studentId);
    List<Fee> findByPaymentStatus(PaymentStatus paymentStatus);

    @Query("SELECT SUM(f.paidAmount) FROM Fee f")
    BigDecimal sumTotalPaidAmount();

    @Query("SELECT SUM(f.dueAmount) FROM Fee f")
    BigDecimal sumTotalDueAmount();
}
