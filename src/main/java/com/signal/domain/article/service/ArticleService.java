package com.signal.domain.article.service;

import com.signal.domain.article.dto.request.ArticleRequest;
import com.signal.domain.article.dto.response.ArticleDetailResponse;
import com.signal.domain.article.dto.response.ArticleResponse;
import com.signal.domain.article.dto.response.SearchResponse;
import com.signal.domain.article.model.Article;
import com.signal.domain.article.repository.ArticleRepository;
import com.signal.domain.auth.model.User;
import com.signal.domain.auth.model.enums.Role;
import com.signal.domain.auth.repository.AuthRepository;
import com.signal.global.dto.PagedDto;
import com.signal.global.exception.errorCode.ErrorCode;
import com.signal.global.exception.handler.InvalidValueException;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
@Slf4j
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final AuthRepository authRepository;

    @Transactional
    public PagedDto<SearchResponse> getArticles(
        int size, int page
    ) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Direction.DESC, "createdAt"));

        Page<Article> articles = articleRepository.findArticles(pageRequest);

        List<ArticleResponse> articleResponses = articles.stream()
            .map(
                ArticleResponse::toDto
            ).collect(Collectors.toList());

        int totalCount = (int) articles.getTotalElements();
        int totalPages = (totalCount + size - 1) / size;

        SearchResponse searchResponse = SearchResponse.toDto(totalCount, articleResponses);

        return PagedDto.toDTO(page, size, totalPages, List.of(searchResponse));
    }

    @Transactional
    public ArticleDetailResponse getArticleById(Long articleId) {
        Article article = articleRepository.findById(articleId)
            .orElseThrow(() -> new InvalidValueException(ErrorCode.ARTICLE_NOT_FOUND));

        articleRepository.incrementViewCountById(articleId);

        return ArticleDetailResponse.toDto(article);
    }

    @Transactional
    public void createArticle(ArticleRequest articleRequest, Long userId) {
        User user = authRepository.findUserById(userId);
        if (user.getRole().equals(Role.USER)) {
           throw new InvalidValueException(ErrorCode.WRONG_ROLE_ARTICLE);
        }

        Article newArticle = Article.toEntity(articleRequest, user);
        articleRepository.save(newArticle);
    }

    @Transactional
    public void updateArticle(ArticleRequest articleRequest, Long articleId, Long userId) {
        articleRepository.existsByIdAndUserId(articleId, userId);
        Article article = articleRepository.findArticleById(articleId);

        article.update(articleRequest);
    }

    public void deleteArticle(Long articleId, Long userId) {
        articleRepository.existsByIdAndUserId(articleId, userId);

        articleRepository.deleteById(articleId);
    }

    @Transactional
    public PagedDto<SearchResponse> getMyArticles (Long userId, int size, int page) {
        authRepository.existsById(userId);

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Direction.DESC, "createdAt"));

        Page<Article> articles = articleRepository.findByUserId(userId, pageRequest);

        List<ArticleResponse> articleResponses = articles.stream()
            .map(
                ArticleResponse::toDto
            ).collect(Collectors.toList());

        int totalCount = (int) articles.getTotalElements();
        int totalPages = (totalCount + size - 1) / size;

        SearchResponse searchResponse = SearchResponse.toDto(totalCount, articleResponses);
        return PagedDto.toDTO(page, size, totalPages, List.of(searchResponse));
    }
}
