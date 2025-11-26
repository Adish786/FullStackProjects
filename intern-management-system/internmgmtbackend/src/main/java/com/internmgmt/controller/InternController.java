package com.internmgmt.controller;


import com.internmgmt.model.Intern;
import com.internmgmt.service.InternService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/interns")
@CrossOrigin(origins = "http://localhost:5173")
public class InternController {
    private final InternService internService;

    public InternController(InternService internService) {
        this.internService = internService;
    }

    @PostMapping
    public ResponseEntity<Intern> addIntern(@RequestBody Intern intern) {
        Intern savedIntern = internService.addIntern(intern);
        return ResponseEntity.ok(savedIntern);
    }

    @GetMapping
    public ResponseEntity<List<Intern>> getAllInterns() {
        return ResponseEntity.ok(internService.getAllInterns());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Intern> updateIntern(@PathVariable Long id, @RequestBody Intern intern) {
        Intern updatedIntern = internService.updateIntern(id, intern);
        return updatedIntern != null ? ResponseEntity.ok(updatedIntern) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIntern(@PathVariable Long id) {
        internService.deleteIntern(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/batch/{batchId}")
    public ResponseEntity<List<Intern>> getInternsByBatch(@PathVariable Long batchId) {
        return ResponseEntity.ok(internService.getInternsByBatch(batchId));
    }
}
