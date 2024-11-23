package com.signal.domain.wish.controller;

import com.signal.domain.wish.service.WishService;
import com.signal.global.sercurity.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
@Tag(name = "wish", description = "상담사 찜하기 기능")
public class WishController {

    private final WishService wishService;

    @Operation(summary = "상담사 좋아요 추가/삭제")
    @PostMapping("/consultant/{consultantId}/wish")
    public ResponseEntity<String> wishConsultant(
        @PathVariable Long consultantId,
        @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {
        Long userId = customUserDetails.getUserId();
        return ResponseEntity.ok(wishService.wishConsultant(consultantId, userId));
    }
}
