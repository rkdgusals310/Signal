package com.signal.domain.likes.controller;

import com.signal.domain.likes.dto.MyLikesResponse;
import com.signal.domain.likes.service.LikesService;
import com.signal.global.dto.PagedDto;
import com.signal.global.sercurity.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@Tag(name = "like", description = "좋아요 기능")
public class LikesController {

    private final LikesService likesService;

    @Operation(summary = "게시글 좋아요 추가/삭제")
    @PostMapping("/user/post/{postId}/like")
    public ResponseEntity<String> likesPost(
        @PathVariable Long postId,
        @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {
        Long userId = customUserDetails.getUserId();
        return ResponseEntity.ok(likesService.likesPost(postId, userId));
    }

    @Operation(summary = "아티클 좋아요 추가/삭제")
    @PostMapping("/user/article/{articleId}/like")
    public ResponseEntity<String> likesArticle(
        @PathVariable Long articleId,
        @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {
        Long userId = customUserDetails.getUserId();
        return ResponseEntity.ok(likesService.likesArticle(articleId, userId));
    }

    @Operation(summary = "내가 좋아요한 글 조회")
    @GetMapping("/common/my-like")
    public ResponseEntity<PagedDto<MyLikesResponse>> getMyLikes (
        @AuthenticationPrincipal CustomUserDetails customUserDetails,
        @RequestParam(required = false, value = "size", defaultValue = "10") int size,
        @RequestParam(required = false, value = "page", defaultValue = "0") int page
    ) {
        Long userId = customUserDetails.getUserId();
        return ResponseEntity.ok(likesService.getMyLikes(userId, size, page));
    }

}
