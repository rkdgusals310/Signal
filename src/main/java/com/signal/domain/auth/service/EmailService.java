package com.signal.domain.auth.service;

import com.signal.domain.auth.dto.request.EmailRequest;
import com.signal.domain.auth.dto.request.EmailVerifyRequest;
import com.signal.domain.auth.repository.AuthRepository;
import com.signal.global.exception.errorCode.ErrorCode;
import com.signal.global.exception.handler.InvalidValueException;
import java.time.Duration;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Service
public class EmailService {

    private final AuthRepository authRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final JavaMailSender mailSender;

    private static final String EMAIL_VERIFICATION_PREFIX = "email:verification:";
    private static final String EMAIL_VERIFIED_PREFIX = "email:verified:";

    @Transactional
    public String sendVerificationCode(EmailRequest emailRequest) {
        String email = emailRequest.getEmail();

        String verificationCode = generateVerificationCode();
        redisTemplate
            .opsForValue()
            .set(EMAIL_VERIFICATION_PREFIX + email, verificationCode, Duration.ofMinutes(5));
        sendVerificationCode(email, "Signal 인증코드", "인증코드 : " + verificationCode);
        log.info("Storing verification code in Redis: key={}, code={}", EMAIL_VERIFICATION_PREFIX + email, verificationCode);


        return "Email Send Success";
    }

    @Transactional
    public String verifyEmailCode(EmailVerifyRequest emailVerifyRequest) {
        String email = emailVerifyRequest.getEmail();
        String verificationCode = emailVerifyRequest.getVerificationCode();

        String key = EMAIL_VERIFICATION_PREFIX + email;
        String storedCode = redisTemplate.opsForValue().get(key);
        log.info("Verify email code : {}", storedCode);

        if(storedCode == null || !storedCode.equals(verificationCode)) {
            throw new InvalidValueException(ErrorCode.INVALID_VERIFICATION_CODE);
        }

        redisTemplate.delete(key);
        redisTemplate.opsForValue().set(EMAIL_VERIFIED_PREFIX + email, "true");

        return "Email Verify Success";
    }

    @Transactional
    public void isEmailVerified(String email) {
        String isVerified = redisTemplate.opsForValue().get(EMAIL_VERIFIED_PREFIX + email);

        if (!isVerified.equals("true")) {
            throw new InvalidValueException(ErrorCode.INVALID_VERIFY);
        }
    }

    private String generateVerificationCode() {
        return RandomStringUtils.randomAlphanumeric(6);
    }

    @Async("mailExecutor")
    public void sendVerificationCode(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        mailSender.send(message);
        log.info("Email sent to {}, subject {} text{} ", to, subject, text);
    }

    public void verifyDuplicateEmail(EmailRequest emailRequest) {
        String email = emailRequest.getEmail();
        authRepository.existsUserByEmail(email);
    }
}
