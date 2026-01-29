package com.applylikeprince.repository;

import com.applylikeprince.entity.ApplicationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationLogRepository extends JpaRepository<ApplicationLog, Long> {

    List<ApplicationLog> findByApplicationIdOrderByTimestampDesc(Long applicationId);
}
