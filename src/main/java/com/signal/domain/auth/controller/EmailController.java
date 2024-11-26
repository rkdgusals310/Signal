package com.signal.domain.auth.controller;

import com.signal.domain.auth.dto.request.EmailRequest;
import com.signal.domain.auth.dto.request.EmailVerifyRequest;
import com.signal.domain.auth.service.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth/register")
@Tag(name = "Email", description = "이메일 인증")
public class EmailController {

    private final EmailService emailService;

    @Operation(summary = "이메일 인증코드 보내기")
    @PostMapping("/send-email-code")
    public ResponseEntity<String> sendVerificationCode(
        @RequestBody EmailRequest emailRequest
    ) {
        return ResponseEntity.ok(emailService.sendVerificationCode(emailRequest));
    }

    @Operation(summary = "이메일 인증")
    @PostMapping("/verify-email-code")
    public ResponseEntity<String> verifyEmailCode(
        @RequestBody EmailVerifyRequest emailVerifyRequest
    ) {
        return ResponseEntity.ok(emailService.verifyEmailCode(emailVerifyRequest));
    }

    @Operation(summary = "이메일 중복 여부 확인")
    @PostMapping("/verify-duplicate-email")
    public void verifyDuplicateEmail(
        @RequestBody EmailRequest emailRequest
    ) {
        emailService.verifyDuplicateEmail(emailRequest);
    }
}
