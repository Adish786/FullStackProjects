package com.internmgmt.repository;


import com.internmgmt.enums.IdCardType;
import com.internmgmt.model.Intern;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InternRepository extends JpaRepository<Intern, Long> {
    List<Intern> findByBatchId(Long batchId);

    @Query("SELECT MAX(i.internId) FROM Intern i WHERE i.dateOfJoining = :date AND i.idCardType = :cardType")
    String findLastInternIdByDateAndCardType(@Param("date") java.time.LocalDate date,
                                             @Param("cardType") IdCardType cardType);
}
