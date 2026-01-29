package com.applylikeprince.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStats {

    private long totalApplications;
    private long pendingApplications;
    private long submittedApplications;
    private long interviewsScheduled;
    private long offersReceived;
    private long rejections;
    private int thisWeekApplications;
    private int thisMonthApplications;
}
