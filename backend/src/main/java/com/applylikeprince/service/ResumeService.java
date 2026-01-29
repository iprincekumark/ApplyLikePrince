package com.applylikeprince.service;

import com.applylikeprince.config.FileStorageConfig;
import com.applylikeprince.dto.ResumeDTO;
import com.applylikeprince.entity.Resume;
import com.applylikeprince.entity.User;
import com.applylikeprince.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserService userService;
    private final FileStorageConfig fileStorageConfig;
    private final AIService aiService;

    @Transactional
    public ResumeDTO uploadResume(MultipartFile file) throws IOException {
        User user = userService.getCurrentUser();

        // Validate file
        String contentType = file.getContentType();
        if (!isValidFileType(contentType)) {
            throw new RuntimeException("Invalid file type. Only PDF and DOCX are supported.");
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);
        String uniqueFilename = UUID.randomUUID().toString() + "." + extension;

        // Save file
        Path uploadPath = Paths.get(fileStorageConfig.getUploadDir(), user.getId().toString());
        Files.createDirectories(uploadPath);
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Extract text content
        String rawContent = extractTextFromFile(filePath.toFile(), contentType);

        // Create resume entity
        Resume resume = Resume.builder()
                .user(user)
                .fileName(uniqueFilename)
                .originalFileName(originalFilename)
                .fileType(contentType)
                .filePath(filePath.toString())
                .fileSize(file.getSize())
                .rawContent(rawContent)
                .build();

        // If this is the first resume, make it primary
        List<Resume> existingResumes = resumeRepository.findByUserIdAndIsActiveTrue(user.getId());
        if (existingResumes.isEmpty()) {
            resume.setIsPrimary(true);
        }

        resume = resumeRepository.save(resume);

        // Parse resume with AI asynchronously (in background)
        try {
            parseResumeWithAI(resume);
        } catch (Exception e) {
            log.error("Failed to parse resume with AI: {}", e.getMessage());
        }

        return ResumeDTO.fromEntity(resume);
    }

    private boolean isValidFileType(String contentType) {
        return contentType != null && (contentType.equals("application/pdf") ||
                contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document"));
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }

    private String extractTextFromFile(File file, String contentType) throws IOException {
        if (contentType.equals("application/pdf")) {
            return extractTextFromPDF(file);
        } else if (contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
            return extractTextFromDOCX(file);
        }
        return "";
    }

    private String extractTextFromPDF(File file) throws IOException {
        try (PDDocument document = Loader.loadPDF(file)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private String extractTextFromDOCX(File file) throws IOException {
        try (InputStream is = Files.newInputStream(file.toPath());
                XWPFDocument document = new XWPFDocument(is);
                XWPFWordExtractor extractor = new XWPFWordExtractor(document)) {
            return extractor.getText();
        }
    }

    @Transactional
    public void parseResumeWithAI(Resume resume) {
        try {
            String parsedData = aiService.parseResume(resume.getRawContent());
            resume.setParsedContent(parsedData);

            // Extract individual fields from AI response
            var parsedInfo = aiService.extractResumeFields(parsedData);
            resume.setExtractedName(parsedInfo.name());
            resume.setExtractedEmail(parsedInfo.email());
            resume.setExtractedPhone(parsedInfo.phone());
            resume.setExtractedSkills(parsedInfo.skills());
            resume.setExtractedExperience(parsedInfo.experience());
            resume.setExtractedEducation(parsedInfo.education());

            resumeRepository.save(resume);
        } catch (Exception e) {
            log.error("Error parsing resume with AI: {}", e.getMessage());
        }
    }

    public List<ResumeDTO> getUserResumes() {
        User user = userService.getCurrentUser();
        return resumeRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(ResumeDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public ResumeDTO getResumeById(Long id) {
        User user = userService.getCurrentUser();
        Resume resume = resumeRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Resume not found"));
        return ResumeDTO.fromEntity(resume);
    }

    public Resume getResumeEntityById(Long id) {
        User user = userService.getCurrentUser();
        return resumeRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Resume not found"));
    }

    @Transactional
    public ResumeDTO setPrimaryResume(Long id) {
        User user = userService.getCurrentUser();

        // Remove primary from all resumes
        List<Resume> userResumes = resumeRepository.findByUserIdAndIsActiveTrue(user.getId());
        for (Resume r : userResumes) {
            r.setIsPrimary(false);
            resumeRepository.save(r);
        }

        // Set new primary
        Resume resume = resumeRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Resume not found"));
        resume.setIsPrimary(true);
        resume = resumeRepository.save(resume);

        return ResumeDTO.fromEntity(resume);
    }

    @Transactional
    public void deleteResume(Long id) {
        User user = userService.getCurrentUser();
        Resume resume = resumeRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        // Delete file
        try {
            Files.deleteIfExists(Paths.get(resume.getFilePath()));
        } catch (IOException e) {
            log.error("Failed to delete resume file: {}", e.getMessage());
        }

        resume.setIsActive(false);
        resumeRepository.save(resume);
    }
}
