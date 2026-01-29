package com.applylikeprince.dto;

import com.applylikeprince.entity.Platform;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlatformDTO {

    private Long id;
    private String name;
    private String displayName;
    private String description;
    private String logoUrl;
    private String baseUrl;
    private String type;
    private Boolean requiresLogin;

    public static PlatformDTO fromEntity(Platform platform) {
        return PlatformDTO.builder()
                .id(platform.getId())
                .name(platform.getName())
                .displayName(platform.getDisplayName())
                .description(platform.getDescription())
                .logoUrl(platform.getLogoUrl())
                .baseUrl(platform.getBaseUrl())
                .type(platform.getType().name())
                .requiresLogin(platform.getRequiresLogin())
                .build();
    }
}
