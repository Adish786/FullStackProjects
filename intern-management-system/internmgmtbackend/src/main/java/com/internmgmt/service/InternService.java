package com.internmgmt.service;


import com.internmgmt.model.Intern;
import com.internmgmt.repository.InternRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class InternService {
    private final InternRepository internRepository;
    private final InternIdGenerator idGenerator;
    private final BatchService batchService;

    public InternService(InternRepository internRepository, InternIdGenerator idGenerator, BatchService batchService) {
        this.internRepository = internRepository;
        this.idGenerator = idGenerator;
        this.batchService = batchService;
    }

    public Intern addIntern(Intern intern) {
        // Generate custom ID
        String internId = idGenerator.generateInternId(
                intern.getDateOfJoining(),
                intern.getIdCardType()
        );
        intern.setInternId(internId);

        return internRepository.save(intern);
    }

    public List<Intern> getAllInterns() {
        return internRepository.findAll();
    }

    public Intern updateIntern(Long id, Intern internDetails) {
        Intern intern = internRepository.findById(id).orElse(null);
        if (intern != null) {
            intern.setName(internDetails.getName());
            intern.setEmail(internDetails.getEmail());
            intern.setMobileNumber(internDetails.getMobileNumber());
            return internRepository.save(intern);
        }
        return null;
    }

    public void deleteIntern(Long id) {
        internRepository.deleteById(id);
    }

    public List<Intern> getInternsByBatch(Long batchId) {
        return internRepository.findByBatchId(batchId);
    }
}
