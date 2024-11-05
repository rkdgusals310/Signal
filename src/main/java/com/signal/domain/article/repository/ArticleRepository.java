package com.signal.domain.article.repository;

import com.signal.domain.article.model.Article;
import com.signal.global.exception.errorCode.ErrorCode;
import com.signal.global.exception.handler.EntityNotFoundException;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticleRepository extends JpaRepository<Article, Long> {

    default Article findArticleById(Long articleId) {
        return findById(articleId).orElseThrow(() -> new EntityNotFoundException(ErrorCode.NOT_FOUND));
    }
}
