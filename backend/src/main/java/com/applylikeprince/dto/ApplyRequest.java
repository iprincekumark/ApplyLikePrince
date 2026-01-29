package com.applylikeprince.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplyRequest {

    @NotNull(message = "Resume ID is required")
    private Long resumeId;

    @NotEmpty(message = "At least one platform must be selected")
    private List<Long> platformIds;

    private String jobTitle;
    private String company;
    private String jobUrl;
    private String location;
    private String customCoverLetter;
    private Boolean generateCoverLetter;
}
