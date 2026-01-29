package com.applylikeprince.service;

import com.applylikeprince.dto.UserDTO;
import com.applylikeprince.entity.User;
import com.applylikeprince.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserDTO getCurrentUserDTO() {
        return UserDTO.fromEntity(getCurrentUser());
    }

    @Transactional
    public UserDTO updateProfile(UserDTO updateRequest) {
        User user = getCurrentUser();

        if (updateRequest.getFullName() != null) {
            user.setFullName(updateRequest.getFullName());
        }
        if (updateRequest.getPhone() != null) {
            user.setPhone(updateRequest.getPhone());
        }
        if (updateRequest.getSkills() != null) {
            user.setSkills(updateRequest.getSkills());
        }
        if (updateRequest.getExperience() != null) {
            user.setExperience(updateRequest.getExperience());
        }
        if (updateRequest.getLinkedinUrl() != null) {
            user.setLinkedinUrl(updateRequest.getLinkedinUrl());
        }
        if (updateRequest.getGithubUrl() != null) {
            user.setGithubUrl(updateRequest.getGithubUrl());
        }
        if (updateRequest.getPortfolioUrl() != null) {
            user.setPortfolioUrl(updateRequest.getPortfolioUrl());
        }
        if (updateRequest.getAdditionalInfo() != null) {
            user.setAdditionalInfo(updateRequest.getAdditionalInfo());
        }

        user = userRepository.save(user);
        return UserDTO.fromEntity(user);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
}
