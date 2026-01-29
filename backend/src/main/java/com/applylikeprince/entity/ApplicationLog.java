package com.applylikeprince.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "application_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private JobApplication application;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LogAction action;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Enumerated(EnumType.STRING)
    private LogLevel level;

    private String ipAddress;

    private String userAgent;

    @CreationTimestamp
    private LocalDateTime timestamp;

    public enum LogAction {
        CREATED, STARTED, FORM_FILLED, SUBMITTED, FAILED, RETRIED, STATUS_CHANGED, VIEWED
    }

    public enum LogLevel {
        INFO, WARNING, ERROR, DEBUG
    }
}
