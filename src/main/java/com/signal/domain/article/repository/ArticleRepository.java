package com.signal.domain.article.repository;

import com.signal.domain.article.model.Article;
import com.signal.domain.auth.dto.response.ConsultantDetailArticleResponse;
import com.signal.domain.auth.dto.response.ConsultantDetailReviewResponse;
import com.signal.domain.post.model.Post;
import com.signal.domain.review.model.Review;
import com.signal.global.exception.errorCode.ErrorCode;
import com.signal.global.exception.handler.EntityNotFoundException;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface ArticleRepository extends JpaRepository<Article,Long> {
	
	@Transactional
    @Modifying
    @Query("UPDATE Article a SET a.viewCount = a.viewCount + 1 WHERE a.id = :id")
    void incrementViewCountById(@Param("id")Long articleId);

	@Transactional
	@Modifying
	@Query("UPDATE Article a SET a.likesCount=a.likesCount+1 WHERE a.id=:id")
	void incrementLikesCountById(@Param("id")Long articleId);

	@Transactional
	@Modifying
	@Query("UPDATE Article a SET a.likesCount=a.likesCount-1 WHERE a.id=:id")
	void decrementLikesCountById(@Param("id")Long articleId);


	@Query("SELECT a FROM Article a WHERE a.deletedAt IS NULL")
	Page<Article> findAllByDeletedAtIsNull(Pageable pageable);

    default Article findArticleById(Long articleId) {
        return findById(articleId).orElseThrow(() -> new EntityNotFoundException(ErrorCode.NOT_FOUND));
    }

    @Query("SELECT a FROM Article a WHERE a.deletedAt IS NULL")
    Page<Article> findArticles(Pageable pageable);

    @Query("SELECT a.id FROM Article a WHERE a.id = :articleId AND a.user.id = :userId")
    Long findByArticleIdAndUserId(Long articleId, Long userId);

    default boolean existsByIdAndUserId(Long articleId, Long userId) {
        if (findByArticleIdAndUserId(articleId, userId) == null) throw new EntityNotFoundException(
            ErrorCode.NOT_FOUND);
        return true;
    }

    @Query("SELECT a FROM Article a WHERE a.deletedAt IS NULL AND a.user.id = :userId")
    Page<Article> findByUserId(
        @Param("userId") Long userId,
        Pageable pageable
    );

    @Query("SELECT a FROM Article a WHERE a.deletedAt IS NULL ORDER BY a.viewCount DESC, a.createdAt DESC")
    Page<Article> findTop5ByViewCount(Pageable pageable);
    
    
    @Query("SELECT new com.signal.domain.auth.dto.response.ConsultantDetailArticleResponse(a.thumbnail, a.title) " +
    	       "FROM Article a WHERE a.user.id = :consultantId")
    	List<ConsultantDetailArticleResponse> findConsultantById(@Param("consultantId") Long consultantId);

    
    
    
}
