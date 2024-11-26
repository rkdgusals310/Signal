package com.signal.domain.article.dto.response;

import com.signal.domain.article.model.Article;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class RecommendArticleResponse {

    private Long id;
    private String thumbnail;
    private String title;

    public static RecommendArticleResponse toDto(Article article) {
        return RecommendArticleResponse.builder()
            .id(article.getId())
            .thumbnail(article.getThumbnail())
            .title(article.getTitle())
            .build()
            ;
    }
}
