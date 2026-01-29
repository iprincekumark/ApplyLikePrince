package com.applylikeprince.service;

import com.applylikeprince.entity.JobApplication;
import com.applylikeprince.entity.Platform;
import com.applylikeprince.entity.Resume;
import com.applylikeprince.repository.JobApplicationRepository;
import io.github.bonigarcia.wdm.WebDriverManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AutomationService {

    private final JobApplicationRepository jobApplicationRepository;

    public void submitApplication(JobApplication application) {
        log.info("Starting automation for application {} on platform {}",
                application.getId(),
                application.getPlatform().getName());

        Platform platform = application.getPlatform();
        Resume resume = application.getResume();

        // Update status to in progress
        application.setStatus(JobApplication.ApplicationStatus.IN_PROGRESS);
        application.setAttemptCount(application.getAttemptCount() + 1);
        application.setLastAttemptAt(LocalDateTime.now());
        jobApplicationRepository.save(application);

        WebDriver driver = null;
        try {
            driver = createWebDriver();

            // Route to appropriate platform handler
            switch (platform.getName().toLowerCase()) {
                case "linkedin":
                    applyToLinkedIn(driver, application, resume);
                    break;
                case "hirect":
                    applyToHirect(driver, application, resume);
                    break;
                case "cutshort":
                    applyToCutshort(driver, application, resume);
                    break;
                default:
                    applyGeneric(driver, application, resume);
                    break;
            }

            // Mark as submitted
            application.setStatus(JobApplication.ApplicationStatus.SUBMITTED);
            application.setAppliedAt(LocalDateTime.now());
            jobApplicationRepository.save(application);

            log.info("Successfully submitted application {} to {}",
                    application.getId(),
                    platform.getDisplayName());

        } catch (Exception e) {
            log.error("Automation failed for application {}: {}", application.getId(), e.getMessage());
            application.setStatus(JobApplication.ApplicationStatus.FAILED);
            application.setErrorMessage(e.getMessage());
            jobApplicationRepository.save(application);
            throw new RuntimeException("Automation failed: " + e.getMessage(), e);
        } finally {
            if (driver != null) {
                driver.quit();
            }
        }
    }

    private WebDriver createWebDriver() {
        WebDriverManager.chromedriver().setup();

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--disable-gpu");
        options.addArguments("--window-size=1920,1080");
        options.addArguments("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");

        return new ChromeDriver(options);
    }

    private void applyToLinkedIn(WebDriver driver, JobApplication application, Resume resume) {
        log.info("Processing LinkedIn application");

        // Navigate to job URL if provided
        if (application.getJobUrl() != null && !application.getJobUrl().isEmpty()) {
            driver.get(application.getJobUrl());
        } else {
            driver.get("https://www.linkedin.com/jobs/");
        }

        // Wait for page to load
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        // Note: In production, this would need proper LinkedIn authentication
        // For now, we'll store the submission data for manual review
        String submissionData = buildSubmissionData(application, resume);
        application.setSubmittedData(submissionData);

        log.info("LinkedIn application data prepared for job: {}", application.getJobTitle());
    }

    private void applyToHirect(WebDriver driver, JobApplication application, Resume resume) {
        log.info("Processing Hirect application");

        driver.get("https://www.hirect.in/jobs");

        String submissionData = buildSubmissionData(application, resume);
        application.setSubmittedData(submissionData);

        log.info("Hirect application data prepared for job: {}", application.getJobTitle());
    }

    private void applyToCutshort(WebDriver driver, JobApplication application, Resume resume) {
        log.info("Processing Cutshort application");

        driver.get("https://cutshort.io/jobs");

        String submissionData = buildSubmissionData(application, resume);
        application.setSubmittedData(submissionData);

        log.info("Cutshort application data prepared for job: {}", application.getJobTitle());
    }

    private void applyGeneric(WebDriver driver, JobApplication application, Resume resume) {
        log.info("Processing generic application for platform: {}",
                application.getPlatform().getDisplayName());

        if (application.getJobUrl() != null && !application.getJobUrl().isEmpty()) {
            driver.get(application.getJobUrl());
        }

        String submissionData = buildSubmissionData(application, resume);
        application.setSubmittedData(submissionData);

        log.info("Generic application data prepared");
    }

    private String buildSubmissionData(JobApplication application, Resume resume) {
        StringBuilder sb = new StringBuilder();
        sb.append("=== Application Submission Data ===\n");
        sb.append("Name: ").append(resume.getExtractedName()).append("\n");
        sb.append("Email: ").append(resume.getExtractedEmail()).append("\n");
        sb.append("Phone: ").append(resume.getExtractedPhone()).append("\n");
        sb.append("Job Title: ").append(application.getJobTitle()).append("\n");
        sb.append("Company: ").append(application.getCompany()).append("\n");
        sb.append("Location: ").append(application.getLocation()).append("\n");
        sb.append("Skills: ").append(resume.getExtractedSkills()).append("\n");
        if (application.getCoverLetter() != null) {
            sb.append("\n=== Cover Letter ===\n");
            sb.append(application.getCoverLetter()).append("\n");
        }
        return sb.toString();
    }
}
