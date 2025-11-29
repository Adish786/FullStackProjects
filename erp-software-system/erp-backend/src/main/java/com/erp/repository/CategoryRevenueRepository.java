package com.erp.repository;

import com.erp.entity.CategoryRevenue;
import com.erp.enums.ReportPeriod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CategoryRevenueRepository extends JpaRepository<CategoryRevenue, Long> {

    List<CategoryRevenue> findByPeriodAndPeriodDateOrderByRevenueDesc(ReportPeriod period, LocalDate periodDate);

    @Query("SELECT cr FROM CategoryRevenue cr WHERE cr.period = :period AND cr.periodDate = :periodDate ORDER BY cr.revenue DESC")
    List<CategoryRevenue> findCategoriesByPeriodAndDate(@Param("period") ReportPeriod period,
                                                        @Param("periodDate") LocalDate periodDate);


    List<CategoryRevenue> findByPeriodOrderByPeriodDateDesc(ReportPeriod period);


}