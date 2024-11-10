package com.signal.domain.article.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.signal.domain.article.model.Article;

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
}
