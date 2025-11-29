package com.erp.repository;

import com.erp.entity.ProductSales;
import com.erp.enums.ReportPeriod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProductSalesRepository extends JpaRepository<ProductSales, Long> {

    List<ProductSales> findByPeriodAndPeriodDateOrderBySalesRankAsc(ReportPeriod period, LocalDate periodDate);

    @Query("SELECT ps FROM ProductSales ps WHERE ps.period = :period AND ps.periodDate = :periodDate ORDER BY ps.revenue DESC LIMIT :limit")
    List<ProductSales> findTopProductsByPeriodAndDate(@Param("period") ReportPeriod period,
                                                      @Param("periodDate") LocalDate periodDate,
                                                      @Param("limit") int limit);

    @Query("SELECT ps FROM ProductSales ps WHERE ps.period = :period ORDER BY ps.periodDate DESC, ps.salesRank ASC") // Fixed: ps.rank -> ps.salesRank
    List<ProductSales> findLatestTopProducts(@Param("period") ReportPeriod period, @Param("limit") int limit);

    List<ProductSales> findByPeriodOrderByPeriodDateDesc(ReportPeriod period);
}