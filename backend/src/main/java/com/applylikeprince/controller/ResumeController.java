package com.applylikeprince.controller;

import com.applylikeprince.dto.ResumeDTO;
import com.applylikeprince.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping("/upload")
    public ResponseEntity<ResumeDTO> uploadResume(@RequestParam("file") MultipartFile file) throws IOException {
        ResumeDTO resume = resumeService.uploadResume(file);
        return ResponseEntity.ok(resume);
    }

    @GetMapping
    public ResponseEntity<List<ResumeDTO>> getUserResumes() {
        List<ResumeDTO> resumes = resumeService.getUserResumes();
        return ResponseEntity.ok(resumes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResumeDTO> getResumeById(@PathVariable Long id) {
        ResumeDTO resume = resumeService.getResumeById(id);
        return ResponseEntity.ok(resume);
    }

    @PutMapping("/{id}/primary")
    public ResponseEntity<ResumeDTO> setPrimaryResume(@PathVariable Long id) {
        ResumeDTO resume = resumeService.setPrimaryResume(id);
        return ResponseEntity.ok(resume);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteResume(@PathVariable Long id) {
        resumeService.deleteResume(id);
        return ResponseEntity.ok(Map.of("message", "Resume deleted successfully"));
    }
}
