package com.signal.domain.auth.controller;

import com.signal.domain.auth.dto.request.ConsultantSignUpRequest;
import com.signal.domain.auth.dto.request.ConsultantUpdateRequest;
import com.signal.domain.auth.dto.request.EmailRequest;
import com.signal.domain.auth.dto.request.UserPasswordResetRequest;
import com.signal.domain.auth.dto.request.UserSignUpRequest;
import com.signal.domain.auth.dto.request.UserUpdateRequest;
import com.signal.domain.auth.dto.response.FindIdResponse;
import com.signal.domain.auth.dto.response.UserDetailResponse;
import com.signal.domain.auth.service.UserService;
import com.signal.global.sercurity.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@Tag(name = "Auth", description = "로그인/로그아웃/회원가입")
public class UserController {

    private final UserService userService;

    @PostMapping("/user-signup")
    @Operation(summary = "일반 사용자 회원가입")
    public ResponseEntity<String> userSignup (
        @Valid @RequestBody
        UserSignUpRequest userSignUpRequest
    ) {
        return ResponseEntity.ok(userService.userSignup(userSignUpRequest));
    }

    @GetMapping("/user/my-information")
    @Operation(summary = "일반 사용자 정보 조회")
    public ResponseEntity<UserDetailResponse> getUserDetails(
        @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {
        return ResponseEntity.ok(customUserDetails.getUserDetails());
    }

    @PostMapping("/consultant-signup")
    @Operation(summary = "전문가 사용자 회원가입")
    public ResponseEntity<String> consultantSignup (
        @Valid @RequestBody
        ConsultantSignUpRequest consultantSignUpRequest
    ) {
        return ResponseEntity.ok(userService.consultantSignup(consultantSignUpRequest));
    }

    @GetMapping("/consultant/my-information")
    @Operation(summary = "전문가 사용자 정보 조회")
    public ResponseEntity<UserDetailResponse> getConsultantDetails(
        @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {
        return ResponseEntity.ok(customUserDetails.getUserDetails());
    }

    @PutMapping("/edit/my-information")
    @Operation(summary = "일반 사용자 회원정보 수정")
    public ResponseEntity<String> editUserInformation (
        @Valid @RequestBody
        UserUpdateRequest userUpdateRequest,
        @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {
        Long userId = customUserDetails.getUserId();
        return ResponseEntity.ok(userService.editUserInformation(userUpdateRequest, userId));
    }

    @PutMapping("/consultant/edit/my-information")
    @Operation(summary = "전문 상담사 프로필 수정")
    public ResponseEntity<String> editConsultantInformation (
        @Valid @RequestBody
        ConsultantUpdateRequest consultantUpdateRequest,
        @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {
        Long consultantId = customUserDetails.getUserId();
        return ResponseEntity.ok(userService.editConsultantInformation(consultantUpdateRequest, consultantId));
    }

    @GetMapping("/find-id")
    @Operation(summary = "id 찾기")
    public ResponseEntity<FindIdResponse> findId(
        @Valid @RequestBody
        EmailRequest emailRequest
    ) {
        return ResponseEntity.ok(userService.findId(emailRequest));
    }

    @PutMapping("/reset-password")
    @Operation(summary = "PW 재설정")
    public ResponseEntity<String> resetPassword (
        @Valid @RequestBody
        UserPasswordResetRequest userPasswordResetRequest
    ) {
        return ResponseEntity.ok(userService.resetPassword(userPasswordResetRequest));
    }

    @Operation(summary = "로그인")
    @GetMapping("/login")
    public String login() {
        return "http://localhost:3000/login";
    }

    @Operation(summary = "로그아웃")
    @PostMapping("/logout")
    public void logout(
        HttpServletRequest request
    ){
        request.getSession().invalidate();
        SecurityContextHolder.clearContext();
    }
//    
//    @GetMapping("/")
//    public String rootRedirect() {
//        return "redirect:/api/auth/login";  // 루트 경로에 접속하면 로그인 페이지로 리디렉트
//    }

}
