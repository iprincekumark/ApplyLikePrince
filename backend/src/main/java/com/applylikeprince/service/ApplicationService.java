package com.applylikeprince.service;

import com.applylikeprince.dto.*;
import com.applylikeprince.entity.*;
import com.applylikeprince.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final PlatformRepository platformRepository;
    private final ApplicationLogRepository applicationLogRepository;
    private final UserService userService;
    private final ResumeService resumeService;
    private final AIService aiService;
    private final AutomationService automationService;

    @Transactional
    public List<ApplicationDTO> applyToJobs(ApplyRequest request) {
        User user = userService.getCurrentUser();
        Resume resume = resumeService.getResumeEntityById(request.getResumeId());

        List<ApplicationDTO> results = new ArrayList<>();

        for (Long platformId : request.getPlatformIds()) {
            Platform platform = platformRepository.findById(platformId)
                    .orElseThrow(() -> new RuntimeException("Platform not found: " + platformId));

            // Create application record
            JobApplication application = JobApplication.builder()
                    .user(user)
                    .platform(platform)
                    .resume(resume)
                    .jobTitle(request.getJobTitle())
                    .company(request.getCompany())
                    .jobUrl(request.getJobUrl())
                    .location(request.getLocation())
                    .status(JobApplication.ApplicationStatus.PENDING)
                    .attemptCount(0)
                    .build();

            // Generate cover letter if requested
            if (Boolean.TRUE.equals(request.getGenerateCoverLetter())) {
                String coverLetter = aiService.generateCoverLetter(
                        resume.getRawContent(),
                        request.getJobTitle(),
                        request.getCompany(),
                        null);
                application.setCoverLetter(coverLetter);
            } else if (request.getCustomCoverLetter() != null) {
                application.setCoverLetter(request.getCustomCoverLetter());
            }

            application = jobApplicationRepository.save(application);

            // Log creation
            logApplicationAction(application, ApplicationLog.LogAction.CREATED, "Application created");

            // Trigger automation (async in production)
            try {
                automationService.submitApplication(application);
            } catch (Exception e) {
                log.error("Automation failed for application {}: {}", application.getId(), e.getMessage());
                application.setStatus(JobApplication.ApplicationStatus.FAILED);
                application.setErrorMessage(e.getMessage());
                jobApplicationRepository.save(application);
                logApplicationAction(application, ApplicationLog.LogAction.FAILED, e.getMessage());
            }

            results.add(ApplicationDTO.fromEntity(application));
        }

        return results;
    }

    public Page<ApplicationDTO> getApplicationHistory(int page, int size) {
        User user = userService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);

        return jobApplicationRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable)
                .map(ApplicationDTO::fromEntity);
    }

    public List<ApplicationDTO> getRecentApplications() {
        User user = userService.getCurrentUser();
        return jobApplicationRepository.findTop10ByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(ApplicationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public ApplicationDTO getApplicationById(Long id) {
        User user = userService.getCurrentUser();
        JobApplication application = jobApplicationRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Application not found"));
        return ApplicationDTO.fromEntity(application);
    }

    public DashboardStats getDashboardStats() {
        User user = userService.getCurrentUser();
        Long userId = user.getId();

        long total = jobApplicationRepository.countByUserId(userId);
        long pending = jobApplicationRepository.countByUserIdAndStatus(userId,
                JobApplication.ApplicationStatus.PENDING);
        long submitted = jobApplicationRepository.countByUserIdAndStatus(userId,
                JobApplication.ApplicationStatus.SUBMITTED);
        long interviews = jobApplicationRepository.countByUserIdAndStatus(userId,
                JobApplication.ApplicationStatus.INTERVIEW_SCHEDULED);
        long offers = jobApplicationRepository.countByUserIdAndStatus(userId,
                JobApplication.ApplicationStatus.OFFER_RECEIVED);
        long rejections = jobApplicationRepository.countByUserIdAndStatus(userId,
                JobApplication.ApplicationStatus.REJECTED);

        // This week's applications
        LocalDateTime weekStart = LocalDateTime.now().minusWeeks(1);
        int thisWeek = jobApplicationRepository.findByUserIdAndCreatedAtAfter(userId, weekStart).size();

        // This month's applications
        LocalDateTime monthStart = LocalDateTime.now().minusMonths(1);
        int thisMonth = jobApplicationRepository.findByUserIdAndCreatedAtAfter(userId, monthStart).size();

        return DashboardStats.builder()
                .totalApplications(total)
                .pendingApplications(pending)
                .submittedApplications(submitted)
                .interviewsScheduled(interviews)
                .offersReceived(offers)
                .rejections(rejections)
                .thisWeekApplications(thisWeek)
                .thisMonthApplications(thisMonth)
                .build();
    }

    @Transactional
    public ApplicationDTO updateApplicationStatus(Long id, String status) {
        User user = userService.getCurrentUser();
        JobApplication application = jobApplicationRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Application not found"));

        JobApplication.ApplicationStatus newStatus = JobApplication.ApplicationStatus.valueOf(status);
        application.setStatus(newStatus);
        application = jobApplicationRepository.save(application);

        logApplicationAction(application, ApplicationLog.LogAction.STATUS_CHANGED, "Status changed to " + status);

        return ApplicationDTO.fromEntity(application);
    }

    private void logApplicationAction(JobApplication application, ApplicationLog.LogAction action, String details) {
        ApplicationLog log = ApplicationLog.builder()
                .application(application)
                .action(action)
                .details(details)
                .level(ApplicationLog.LogLevel.INFO)
                .build();
        applicationLogRepository.save(log);
    }
}
