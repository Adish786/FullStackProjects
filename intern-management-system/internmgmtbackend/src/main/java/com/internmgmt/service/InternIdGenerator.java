package com.internmgmt.service;


import com.internmgmt.enums.IdCardType;
import com.internmgmt.repository.InternRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class InternIdGenerator {
    private final InternRepository internRepository;

    public InternIdGenerator(InternRepository internRepository) {
        this.internRepository = internRepository;
    }

    public String generateInternId(LocalDate dateOfJoining, IdCardType cardType) {
        String prefix = cardType == IdCardType.PREMIUM ? "EMP" : "TDA";
        String datePart = dateOfJoining.format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        // Find the last generated ID for this date and card type
        String lastId = internRepository.findLastInternIdByDateAndCardType(dateOfJoining, cardType);

        int sequenceNumber = 1;
        if (lastId != null) {
            String[] parts = lastId.split("-");
            if (parts.length == 2) {
                sequenceNumber = Integer.parseInt(parts[1]) + 1;
            }
        }

        return String.format("%s%s-%03d", prefix, datePart, sequenceNumber);
    }
}
