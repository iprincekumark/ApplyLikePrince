package com.applylikeprince.controller;

import com.applylikeprince.dto.PlatformDTO;
import com.applylikeprince.service.PlatformService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/platforms")
@RequiredArgsConstructor
public class PlatformController {

    private final PlatformService platformService;

    @GetMapping
    public ResponseEntity<List<PlatformDTO>> getAllPlatforms() {
        List<PlatformDTO> platforms = platformService.getAllActivePlatforms();
        return ResponseEntity.ok(platforms);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlatformDTO> getPlatformById(@PathVariable Long id) {
        PlatformDTO platform = platformService.getPlatformById(id);
        return ResponseEntity.ok(platform);
    }
}
