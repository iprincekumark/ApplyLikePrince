package com.applylikeprince.controller;

import com.applylikeprince.dto.ApplicationDTO;
import com.applylikeprince.dto.ApplyRequest;
import com.applylikeprince.dto.DashboardStats;
import com.applylikeprince.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/apply")
    public ResponseEntity<List<ApplicationDTO>> applyToJobs(@Valid @RequestBody ApplyRequest request) {
        List<ApplicationDTO> applications = applicationService.applyToJobs(request);
        return ResponseEntity.ok(applications);
    }

    @GetMapping
    public ResponseEntity<Page<ApplicationDTO>> getApplicationHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ApplicationDTO> applications = applicationService.getApplicationHistory(page, size);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<ApplicationDTO>> getRecentApplications() {
        List<ApplicationDTO> applications = applicationService.getRecentApplications();
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        DashboardStats stats = applicationService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationDTO> getApplicationById(@PathVariable Long id) {
        ApplicationDTO application = applicationService.getApplicationById(id);
        return ResponseEntity.ok(application);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApplicationDTO> updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        ApplicationDTO application = applicationService.updateApplicationStatus(id, status);
        return ResponseEntity.ok(application);
    }
}
