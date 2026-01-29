package com.applylikeprince.dto;

import com.applylikeprince.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private String skills;
    private String experience;
    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;
    private String additionalInfo;
    private LocalDateTime createdAt;

    public static UserDTO fromEntity(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .skills(user.getSkills())
                .experience(user.getExperience())
                .linkedinUrl(user.getLinkedinUrl())
                .githubUrl(user.getGithubUrl())
                .portfolioUrl(user.getPortfolioUrl())
                .additionalInfo(user.getAdditionalInfo())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
