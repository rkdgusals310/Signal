package com.signal.domain.article.controller;

import com.signal.domain.article.dto.request.ArticleRequest;
import com.signal.domain.article.dto.response.ArticleDetailResponse;
import com.signal.domain.article.dto.response.RecommendArticleResponse;
import com.signal.domain.article.dto.response.SearchResponse;
import com.signal.domain.article.service.ArticleService;
import com.signal.global.dto.PagedDto;
import com.signal.global.sercurity.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
@Tag(name = "article", description = "아티클")
public class ArticleController {

    private final ArticleService articleService;

    // 아티클 전체 조회 (페이지네이션)
    @GetMapping("/common/article")
    @Operation(summary = "아티클 전체 조회")
    public ResponseEntity<PagedDto<SearchResponse>> getAllArticles(
            @RequestParam int page,
            @RequestParam int size) {
        PagedDto<SearchResponse> articles = articleService.getAllArticles(page, size);
        return ResponseEntity.ok(articles);
    }

    // 특정 ID로 아티클 단일 조회
    @GetMapping("/common/article/{articleId}")
    @Operation(summary = "특정 ID로 아티클 단일 조회")
    public ResponseEntity<ArticleDetailResponse> getArticleById(
            @PathVariable Long articleId) {
        ArticleDetailResponse article = articleService.getArticleById(articleId);
        return ResponseEntity.ok(article);
    }

    // 아티클 작성
    @PostMapping("/consultant/article")
    @Operation(summary = "아티클 작성")
    public void createArticle(
    		@AuthenticationPrincipal CustomUserDetails customUserDetails,
            @RequestBody ArticleRequest articleRequest) {
    	Long userId = customUserDetails.getUserId();
        articleService.createArticle(userId, articleRequest);
    }

    // 아티클 업데이트
    @PutMapping("/consultant/article/{articleId}")
    @Operation(summary = "아티클 업데이트")
    public void updateArticle(
            @PathVariable Long articleId,
            @RequestBody ArticleRequest articleRequest,
            @AuthenticationPrincipal CustomUserDetails customUserDetails) {
    	Long userId = customUserDetails.getUserId();
        articleService.updateArticle(articleId, userId, articleRequest);
    }

    // 아티클 삭제
    @DeleteMapping("/consultant/article/{articleId}")
    @Operation(summary = "아티클 삭제")
    public void deleteArticle(
            @PathVariable Long articleId,
            @AuthenticationPrincipal CustomUserDetails customUserDetails) {
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

    @Operation(summary = "특정 상담사가 작성한 아티클 조회")
    @GetMapping("/common/consultant/{consultantId}/article")
    public ResponseEntity<PagedDto<SearchResponse>> getConsultantArticle(
        @PathVariable Long consultantId,
        @RequestParam(required = false, value = "size", defaultValue = "10") int size,
        @RequestParam(required = false, value = "page", defaultValue = "0") int page
    ) {
        PagedDto<SearchResponse> articles = articleService.getConsultantArticle(consultantId, size, page);

        return ResponseEntity.ok(articles);
    }

    @Operation(summary = "추천 아티클 조회")
    @GetMapping("/common/home/recommend-article")
    public ResponseEntity<List<RecommendArticleResponse>> getRecommendArticle() {
        List<RecommendArticleResponse> articles = articleService.getRecommendArticle();

        return ResponseEntity.ok(articles);
    }
}
