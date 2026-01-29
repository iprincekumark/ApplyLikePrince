package com.applylikeprince.repository;

import com.applylikeprince.entity.JobApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    Page<JobApplication> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    List<JobApplication> findByUserIdAndStatus(Long userId, JobApplication.ApplicationStatus status);

    Optional<JobApplication> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT COUNT(a) FROM JobApplication a WHERE a.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(a) FROM JobApplication a WHERE a.user.id = :userId AND a.status = :status")
    long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") JobApplication.ApplicationStatus status);

    @Query("SELECT a FROM JobApplication a WHERE a.user.id = :userId AND a.createdAt >= :startDate")
    List<JobApplication> findByUserIdAndCreatedAtAfter(@Param("userId") Long userId,
            @Param("startDate") LocalDateTime startDate);

    List<JobApplication> findTop10ByUserIdOrderByCreatedAtDesc(Long userId);
}
