package com.signal.domain.auth.service;

import com.signal.domain.auth.dto.request.ConsultantSignUpRequest;
import com.signal.domain.auth.dto.request.ConsultantUpdateRequest;
import com.signal.domain.auth.dto.request.EmailRequest;
import com.signal.domain.auth.dto.request.UserPasswordResetRequest;
import com.signal.domain.auth.dto.request.UserSignUpRequest;
import com.signal.domain.auth.dto.request.UserUpdateRequest;
import com.signal.domain.auth.dto.response.FindIdResponse;
import com.signal.domain.auth.model.User;
import com.signal.domain.auth.model.enums.Role;
import com.signal.domain.auth.repository.AuthRepository;
import com.signal.global.exception.errorCode.ErrorCode;
import com.signal.global.exception.handler.EntityNotFoundException;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final AuthRepository authRepository;
    private final EmailService emailService;
    //TODO : SecurityConfig 만들어지면 @EnableWebSecurity 어노테이션 있을 경우 에러 해결됨
    private final BCryptPasswordEncoder passwordEncoder;

    public String userSignup(UserSignUpRequest userSignUpRequest) {
        authRepository.existsUserByEmail(userSignUpRequest.getEmail());

        emailService.isEmailVerified(userSignUpRequest.getEmail());

        User user = User.builder()
            .userId(userSignUpRequest.getUserId())
            .password(passwordEncoder.encode(userSignUpRequest.getPassword()))
            .nickname(userSignUpRequest.getNickname())
            .birthday(userSignUpRequest.getBirthday())
            .gender(userSignUpRequest.getGender())
            .email(userSignUpRequest.getEmail())
            .role(Role.USER)
            .createdAt(LocalDateTime.now())
            .build()
            ;

        authRepository.save(user);

        return "User Registered Successfully";
    }

    public String consultantSignup(ConsultantSignUpRequest consultantSignUpRequest) {
        authRepository.existsUserByEmail(consultantSignUpRequest.getEmail());

        emailService.isEmailVerified(consultantSignUpRequest.getEmail());

        User user = User.builder()
            .userId(consultantSignUpRequest.getUserId())
            .password(passwordEncoder.encode(consultantSignUpRequest.getPassword()))
            .nickname(consultantSignUpRequest.getNickname())
            .birthday(consultantSignUpRequest.getBirthday())
            .gender(consultantSignUpRequest.getGender())
            .email(consultantSignUpRequest.getEmail())
            .image(consultantSignUpRequest.getImage())
            .keyword(consultantSignUpRequest.getKeyword())
            .style(consultantSignUpRequest.getStyle())
            .profile(consultantSignUpRequest.getProfile())
            .certifiedQualification(consultantSignUpRequest.getCertifiedQualification())
            .experience(consultantSignUpRequest.getExperience())
            .availableDays(consultantSignUpRequest.getAvailableDays())
            .role(Role.CONSULTANT)
            .createdAt(LocalDateTime.now())
            .build()
            ;

        authRepository.save(user);

        return "Consultant Registered Successfully";
    }

    public String editUserInformation(UserUpdateRequest userUpdateRequest, Long userId) {
        User user = authRepository.findUserById(userId);

        user.update(userUpdateRequest);
        authRepository.save(user);

        return "User Updated Successfully";
    }

    public String editConsultantInformation(ConsultantUpdateRequest consultantUpdateRequest, Long consultantId) {
        User user = authRepository.findConsultantById(consultantId);

        user.update(consultantUpdateRequest);
        authRepository.save(user);

        return "Consultant Updated Successfully";
    }

    public FindIdResponse findId(EmailRequest emailRequest) {
        String email = emailRequest.getEmail();emailService.isEmailVerified(emailRequest.getEmail());
        User user = authRepository.findUserByEmail(email);

        return FindIdResponse.toDto(user);
    }

    public String resetPassword(UserPasswordResetRequest userPasswordResetRequest) {
        String email = userPasswordResetRequest.getEmail();
        String userId = userPasswordResetRequest.getUserId();
        String newPassword = userPasswordResetRequest.getNewPassword();

        User user = authRepository.findUserByEmailAndUserId(email, userId);

        if(user == null) {
            throw new EntityNotFoundException(ErrorCode.USER_NOT_FOUND);
        }

        emailService.isEmailVerified(email);

        user.update(passwordEncoder.encode(newPassword));

        return "User Password Reset Successfully";
    }
}
