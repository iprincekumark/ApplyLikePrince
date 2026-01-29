package com.applylikeprince.dto;

import com.applylikeprince.entity.JobApplication;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationDTO {

    private Long id;
    private Long platformId;
    private String platformName;
    private Long resumeId;
    private String jobTitle;
    private String company;
    private String jobUrl;
    private String location;
    private String status;
    private String coverLetter;
    private LocalDateTime appliedAt;
    private LocalDateTime createdAt;

    public static ApplicationDTO fromEntity(JobApplication application) {
        return ApplicationDTO.builder()
                .id(application.getId())
                .platformId(application.getPlatform().getId())
                .platformName(application.getPlatform().getDisplayName())
                .resumeId(application.getResume() != null ? application.getResume().getId() : null)
                .jobTitle(application.getJobTitle())
                .company(application.getCompany())
                .jobUrl(application.getJobUrl())
                .location(application.getLocation())
                .status(application.getStatus().name())
                .coverLetter(application.getCoverLetter())
                .appliedAt(application.getAppliedAt())
                .createdAt(application.getCreatedAt())
                .build();
    }
}
