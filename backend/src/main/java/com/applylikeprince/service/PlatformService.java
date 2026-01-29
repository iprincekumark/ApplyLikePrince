package com.applylikeprince.service;

import com.applylikeprince.dto.PlatformDTO;
import com.applylikeprince.entity.Platform;
import com.applylikeprince.repository.PlatformRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlatformService {

    private final PlatformRepository platformRepository;

    @PostConstruct
    @Transactional
    public void initializeDefaultPlatforms() {
        if (platformRepository.count() == 0) {
            // LinkedIn
            platformRepository.save(Platform.builder()
                    .name("linkedin")
                    .displayName("LinkedIn")
                    .description("World's largest professional network")
                    .baseUrl("https://www.linkedin.com")
                    .loginUrl("https://www.linkedin.com/login")
                    .applicationUrl("https://www.linkedin.com/jobs")
                    .logoUrl("/platforms/linkedin.svg")
                    .type(Platform.PlatformType.JOB_PORTAL)
                    .requiresLogin(true)
                    .isActive(true)
                    .build());

            // Hirect
            platformRepository.save(Platform.builder()
                    .name("hirect")
                    .displayName("Hirect")
                    .description("Direct hiring app with chat-based recruitment")
                    .baseUrl("https://www.hirect.in")
                    .loginUrl("https://www.hirect.in/login")
                    .applicationUrl("https://www.hirect.in/jobs")
                    .logoUrl("/platforms/hirect.svg")
                    .type(Platform.PlatformType.JOB_PORTAL)
                    .requiresLogin(true)
                    .isActive(true)
                    .build());

            // Cutshort
            platformRepository.save(Platform.builder()
                    .name("cutshort")
                    .displayName("Cutshort")
                    .description("AI-powered tech hiring platform")
                    .baseUrl("https://cutshort.io")
                    .loginUrl("https://cutshort.io/login")
                    .applicationUrl("https://cutshort.io/jobs")
                    .logoUrl("/platforms/cutshort.svg")
                    .type(Platform.PlatformType.JOB_PORTAL)
                    .requiresLogin(true)
                    .isActive(true)
                    .build());

            // Indeed
            platformRepository.save(Platform.builder()
                    .name("indeed")
                    .displayName("Indeed")
                    .description("Largest job search engine worldwide")
                    .baseUrl("https://www.indeed.com")
                    .loginUrl("https://secure.indeed.com/auth")
                    .applicationUrl("https://www.indeed.com/jobs")
                    .logoUrl("/platforms/indeed.svg")
                    .type(Platform.PlatformType.JOB_PORTAL)
                    .requiresLogin(true)
                    .isActive(true)
                    .build());

            // Naukri
            platformRepository.save(Platform.builder()
                    .name("naukri")
                    .displayName("Naukri.com")
                    .description("India's leading job portal")
                    .baseUrl("https://www.naukri.com")
                    .loginUrl("https://www.naukri.com/nlogin/login")
                    .applicationUrl("https://www.naukri.com/jobs")
                    .logoUrl("/platforms/naukri.svg")
                    .type(Platform.PlatformType.JOB_PORTAL)
                    .requiresLogin(true)
                    .isActive(true)
                    .build());

            // Glassdoor
            platformRepository.save(Platform.builder()
                    .name("glassdoor")
                    .displayName("Glassdoor")
                    .description("Job search with company insights")
                    .baseUrl("https://www.glassdoor.com")
                    .loginUrl("https://www.glassdoor.com/profile/login")
                    .applicationUrl("https://www.glassdoor.com/Job")
                    .logoUrl("/platforms/glassdoor.svg")
                    .type(Platform.PlatformType.JOB_PORTAL)
                    .requiresLogin(true)
                    .isActive(true)
                    .build());
        }
    }

    public List<PlatformDTO> getAllActivePlatforms() {
        return platformRepository.findByIsActiveTrue()
                .stream()
                .map(PlatformDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public PlatformDTO getPlatformById(Long id) {
        Platform platform = platformRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Platform not found"));
        return PlatformDTO.fromEntity(platform);
    }

    public Platform getPlatformEntityById(Long id) {
        return platformRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Platform not found"));
    }
}
