package com.signal.domain.article.controller;

import com.signal.domain.article.dto.request.ArticleRequest;
import com.signal.domain.article.dto.response.ArticleDetailResponse;
import com.signal.domain.article.dto.response.SearchResponse;
import com.signal.domain.article.service.ArticleService;
import com.signal.global.dto.PagedDto;
import com.signal.global.sercurity.CustomUserDetails;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class ArticleController {

    private final ArticleService articleService;

    // 아티클 전체 조회 (페이지네이션)
    @GetMapping("/common/article")
    public ResponseEntity<PagedDto<SearchResponse>> getAllArticles(
            @RequestParam int page,
            @RequestParam int size) {
        PagedDto<SearchResponse> articles = articleService.getAllArticles(page, size);
        return ResponseEntity.ok(articles);
    }

    // 특정 ID로 아티클 단일 조회
    @GetMapping("/common/article/{articleId}")
    public ResponseEntity<ArticleDetailResponse> getArticleById(
            @PathVariable Long articleId) {
        ArticleDetailResponse article = articleService.getArticleById(articleId);
        return ResponseEntity.ok(article);
    }

    // 아티클 작성
    @PostMapping("/consultant/article")
    public ResponseEntity<Void> createArticle(
    		@AuthenticationPrincipal CustomUserDetails customUserDetails,
            @RequestBody ArticleRequest articleRequest) {
    	Long userId = customUserDetails.getUserId();
        articleService.createArticle(userId, articleRequest);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    // 아티클 업데이트
    @PutMapping("/consultant/article/{articleId}")
    public ResponseEntity<Void> updateArticle(
            @PathVariable Long articleId,
            @RequestBody ArticleRequest articleRequest,
            @AuthenticationPrincipal CustomUserDetails customUserDetails) {
    	Long userId = customUserDetails.getUserId();
        articleService.updateArticle(articleId, userId, articleRequest);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 아티클 삭제
    @DeleteMapping("/consultant/article/{articleId}")
    public ResponseEntity<Void> deleteArticle(
            @PathVariable Long articleId,
            @AuthenticationPrincipal CustomUserDetails customUserDetails) {
    	Long userId = customUserDetails.getUserId();
        articleService.deleteArticle(articleId, userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
