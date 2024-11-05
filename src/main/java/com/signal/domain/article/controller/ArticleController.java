package com.signal.domain.article.controller;

import com.signal.domain.article.dto.request.ArticleRequest;
import com.signal.domain.article.dto.response.ArticleDetailResponse;
import com.signal.domain.article.dto.response.SearchResponse;
import com.signal.domain.article.service.ArticleService;
import com.signal.global.dto.PagedDto;
import com.signal.global.sercurity.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@Tag(name = "article", description = "아티클")
public class ArticleController {

    private final ArticleService articleService;

    @Operation(summary = "아티클 전체 조회")
    @GetMapping("/common/article")
    public ResponseEntity<PagedDto<SearchResponse>> getArticles(
        @RequestParam(required = false, value = "size", defaultValue = "10") int size,
        @RequestParam(required = false, value = "page", defaultValue = "0") int page
    ) {
        PagedDto<SearchResponse> articles = articleService.getArticles(size, page);
        return ResponseEntity.ok(articles);
    }

    @Operation(summary = "아티클 단일 조회")
    @GetMapping("/common/article/{articleId}")
    public ResponseEntity<ArticleDetailResponse> getArticleById(
        @PathVariable Long articleId
    ) {
        ArticleDetailResponse articleDetailResponse = articleService.getArticleById(articleId);
        return ResponseEntity.ok(articleDetailResponse);
    }

    @Operation(summary = "아티클 작성")
    @PostMapping("/consultant/article")
    public void createArticle(
        @Valid @RequestBody ArticleRequest articleRequest,
        @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {
        Long userId = customUserDetails.getUserId();
        articleService.createArticle(articleRequest, userId);
    }

    @Operation(summary = "아티클 수정")
    @PutMapping("/consultant/article/{articleId}")
    public void updateArticle(
        @Valid @RequestBody ArticleRequest articleRequest,
        @PathVariable Long articleId,
        @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {
        Long userId = customUserDetails.getUserId();
        articleService.updateArticle(articleRequest, articleId, userId);
    }

    @Operation(summary = "아티클 삭제")
    @DeleteMapping("/consultant/article/{articleId}")
    public void deleteArticle(
        @PathVariable Long articleId,
        @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {
        Long userId = customUserDetails.getUserId();
        articleService.deleteArticle(articleId, userId);
    }

    @Operation(summary = "내가 쓴 아티클 조회")
    @GetMapping("/consultant/my-article")
    public ResponseEntity<PagedDto<SearchResponse>> getMyArticles(
        @RequestParam(required = false, value = "size", defaultValue = "10") int size,
        @RequestParam(required = false, value = "page", defaultValue = "0") int page,
        @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {
        Long userId = customUserDetails.getUserId();
        PagedDto<SearchResponse> articles = articleService.getMyArticles(userId, size, page);

        return ResponseEntity.ok(articles);
    }
}
