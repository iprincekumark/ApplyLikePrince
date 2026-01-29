package com.applylikeprince.dto;

import com.applylikeprince.entity.Resume;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeDTO {

    private Long id;
    private String fileName;
    private String originalFileName;
    private String fileType;
    private Long fileSize;
    private String extractedName;
    private String extractedEmail;
    private String extractedPhone;
    private String extractedSkills;
    private String extractedExperience;
    private String extractedEducation;
    private Boolean isPrimary;
    private LocalDateTime createdAt;

    public static ResumeDTO fromEntity(Resume resume) {
        return ResumeDTO.builder()
                .id(resume.getId())
                .fileName(resume.getFileName())
                .originalFileName(resume.getOriginalFileName())
                .fileType(resume.getFileType())
                .fileSize(resume.getFileSize())
                .extractedName(resume.getExtractedName())
                .extractedEmail(resume.getExtractedEmail())
                .extractedPhone(resume.getExtractedPhone())
                .extractedSkills(resume.getExtractedSkills())
                .extractedExperience(resume.getExtractedExperience())
                .extractedEducation(resume.getExtractedEducation())
                .isPrimary(resume.getIsPrimary())
                .createdAt(resume.getCreatedAt())
                .build();
    }
}
