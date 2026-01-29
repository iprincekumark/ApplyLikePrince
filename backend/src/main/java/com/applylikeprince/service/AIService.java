package com.applylikeprince.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String parseResume(String resumeContent) {
        String prompt = """
                Parse the following resume and extract the key information.
                Return the data as a JSON object with the following structure:
                {
                    "name": "Full Name",
                    "email": "email@example.com",
                    "phone": "+1234567890",
                    "skills": "Comma-separated list of skills",
                    "experience": "Summary of work experience",
                    "education": "Summary of education"
                }

                Resume content:
                %s
                """.formatted(resumeContent);

        try {
            return chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();
        } catch (Exception e) {
            log.error("AI parsing failed: {}", e.getMessage());
            return "{}";
        }
    }

    public ResumeFields extractResumeFields(String parsedJson) {
        try {
            // Clean up JSON if it has markdown code blocks
            String cleanJson = parsedJson
                    .replaceAll("```json\\s*", "")
                    .replaceAll("```\\s*", "")
                    .trim();

            JsonNode node = objectMapper.readTree(cleanJson);
            return new ResumeFields(
                    getTextOrNull(node, "name"),
                    getTextOrNull(node, "email"),
                    getTextOrNull(node, "phone"),
                    getTextOrNull(node, "skills"),
                    getTextOrNull(node, "experience"),
                    getTextOrNull(node, "education"));
        } catch (Exception e) {
            log.error("Failed to extract resume fields: {}", e.getMessage());
            return new ResumeFields(null, null, null, null, null, null);
        }
    }

    private String getTextOrNull(JsonNode node, String field) {
        JsonNode fieldNode = node.get(field);
        return fieldNode != null && !fieldNode.isNull() ? fieldNode.asText() : null;
    }

    public String generateCoverLetter(String resumeContent, String jobTitle, String company, String jobDescription) {
        String prompt = """
                Generate a professional cover letter for the following job application.

                Candidate Resume:
                %s

                Job Title: %s
                Company: %s
                Job Description: %s

                Write a compelling cover letter that:
                1. Highlights relevant skills and experience
                2. Shows enthusiasm for the role and company
                3. Is professional but personable
                4. Is concise (about 250-300 words)

                Return only the cover letter text, no JSON or extra formatting.
                """.formatted(resumeContent, jobTitle, company,
                jobDescription != null ? jobDescription : "Not provided");

        try {
            return chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();
        } catch (Exception e) {
            log.error("Cover letter generation failed: {}", e.getMessage());
            return null;
        }
    }

    public String optimizeResumeForJob(String resumeContent, String jobDescription) {
        String prompt = """
                Analyze the following resume against the job description and provide specific suggestions
                for optimizing the resume to better match the job requirements.

                Resume:
                %s

                Job Description:
                %s

                Provide:
                1. Key skills to highlight
                2. Experience points to emphasize
                3. Keywords to include
                4. Any gaps to address

                Return as a structured JSON response.
                """.formatted(resumeContent, jobDescription);

        try {
            return chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();
        } catch (Exception e) {
            log.error("Resume optimization failed: {}", e.getMessage());
            return null;
        }
    }

    public record ResumeFields(
            String name,
            String email,
            String phone,
            String skills,
            String experience,
            String education) {
    }
}
