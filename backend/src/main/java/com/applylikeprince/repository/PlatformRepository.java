package com.applylikeprince.repository;

import com.applylikeprince.entity.Platform;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlatformRepository extends JpaRepository<Platform, Long> {

    List<Platform> findByIsActiveTrue();

    Optional<Platform> findByName(String name);

    List<Platform> findByType(Platform.PlatformType type);
}
