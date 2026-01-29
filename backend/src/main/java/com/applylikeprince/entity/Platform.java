package com.applylikeprince.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "platforms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Platform {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String displayName;

    private String description;

    private String logoUrl;

    @Column(nullable = false)
    private String baseUrl;

    private String loginUrl;

    private String applicationUrl;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PlatformType type = PlatformType.JOB_PORTAL;

    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private Boolean requiresLogin = true;

    @Column(columnDefinition = "TEXT")
    private String automationScript;

    @Column(columnDefinition = "TEXT")
    private String fieldMappings;

    @OneToMany(mappedBy = "platform", cascade = CascadeType.ALL)
    @Builder.Default
    private List<JobApplication> applications = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum PlatformType {
        JOB_PORTAL, COMPANY_CAREER_PAGE, FREELANCE, NETWORKING
    }
}
