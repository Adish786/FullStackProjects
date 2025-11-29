package com.erp.repository;

import com.erp.entity.ReportData;
import com.erp.enums.ReportPeriod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReportDataRepository extends JpaRepository<ReportData, Long> {

    Optional<ReportData> findByPeriodAndPeriodDate(ReportPeriod period, LocalDate periodDate);

    List<ReportData> findByPeriodOrderByPeriodDateDesc(ReportPeriod period);

    @Query("SELECT rd FROM ReportData rd WHERE rd.period = :period AND rd.periodDate BETWEEN :startDate AND :endDate ORDER BY rd.periodDate DESC")
    List<ReportData> findByPeriodAndDateRange(@Param("period") ReportPeriod period,
                                              @Param("startDate") LocalDate startDate,
                                              @Param("endDate") LocalDate endDate);

    @Query("SELECT rd FROM ReportData rd WHERE rd.periodDate = (SELECT MAX(rd2.periodDate) FROM ReportData rd2 WHERE rd2.period = :period)")
    Optional<ReportData> findLatestByPeriod(@Param("period") ReportPeriod period);

}