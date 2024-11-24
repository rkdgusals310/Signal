package com.signal.domain.article.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Sort.Direction;
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
import com.signal.global.exception.handler.AccessDeniedException;
import com.signal.global.exception.handler.EntityNotFoundException;
import com.signal.global.exception.handler.InvalidValueException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Service
@Slf4j
public class ArticleService {
	private final ArticleRepository articleRepository;
	private final AuthRepository authRepository;
	
    // 특정 ID로 아티클 조회
	@Transactional
	public ArticleDetailResponse getArticleById(Long articleId) {
	    Article article = articleRepository.findById(articleId)
	            .orElseThrow(() -> new InvalidValueException(ErrorCode.NOT_FOUND));
	    
	    articleRepository.incrementViewCountById(articleId);
	    
	    return ArticleDetailResponse.toDto(article); 
	}

    // 모든 아티클 조회 (페이지네이션)**
    @Transactional
    public PagedDto<SearchResponse> getAllArticles(int page, int size) {
        if (size < 1) {
            size = 10; 
        }
    	PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
    	 Page<Article> articlesPage = articleRepository.findAllByDeletedAtIsNull(pageRequest);

    	 List<ArticleResponse> articleResponses = articlesPage.getContent().stream()
                 .map(ArticleResponse::toDto)
                 .collect(Collectors.toList());
    	// totalCount 계산
    	    int totalCount = (int) articlesPage.getTotalElements();

    	// SearchResponse 생성
	    SearchResponse searchResponse = SearchResponse.toDto(totalCount, articleResponses);

         // PagedDto를 생성하여 반환
         return PagedDto.toDTO(page, size, articlesPage.getTotalPages(), List.of(searchResponse));
    }




    // 아티클 작성
    @Transactional
    @PreAuthorize("hasRole('CONSULTANT')")
    public void createArticle(Long userId,ArticleRequest articleRequest) {
    	User user = authRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND));

    	if (!user.getRole().equals(Role.CONSULTANT)) {
            throw new AccessDeniedException(ErrorCode.INSUFFICIENT_ROLE);
        }

        Article article = Article.builder()
        		.title(articleRequest.getTitle())
        		.contents(articleRequest.getContents())
        		.thumbnail(articleRequest.getThumbnail())
        		.user(user)
        		.viewCount(0L)
                .likesCount(0l)
                .commentCount(0L)
        		.build();

        articleRepository.save(article);
        log.info("article 작성 완료: {}", article);
    }


    // 아티클 업데이트
    @Transactional
    @PreAuthorize("hasRole('CONSULTANT')")
    public void updateArticle(Long articleId,Long userId,ArticleRequest articleRequest) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.NOT_FOUND));
        if (!article.getUser().getId().equals(userId)) {
            throw new AccessDeniedException(ErrorCode.UNAUTHORIZED);
        }

        article.update(articleRequest);
    }

    // 아티클 삭제
    @Transactional
    @PreAuthorize("hasRole('CONSULTANT')")
    public void deleteArticle(Long articleId,Long userId) {

        Article article = articleRepository.findById(articleId)
            .orElseThrow(() -> new EntityNotFoundException(ErrorCode.NOT_FOUND));
        if (!article.getUser().getId().equals(userId)) {
            throw new AccessDeniedException(ErrorCode.UNAUTHORIZED);
        }

        articleRepository.delete(article);
    }
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

    public PagedDto<SearchResponse> getConsultantArticle (Long consultantId, int size, int page) {
        authRepository.existsConsultantById(consultantId);

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Direction.DESC, "createdAt"));

        Page<Article> articles = articleRepository.findByUserId(consultantId, pageRequest);

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
