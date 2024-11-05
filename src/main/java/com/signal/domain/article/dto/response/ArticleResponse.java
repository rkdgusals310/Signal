package com.signal.domain.article.dto.response;

import com.signal.domain.article.model.Article;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArticleResponse {

    private Long id;
    private String title;
    private String consultantName;
    private LocalDateTime createdAt;
    private Long commentCount;

    public static ArticleResponse toDto(Article article) {
        return ArticleResponse.builder()
            .id(article.getId())
            .title(article.getTitle())
            .consultantName(article.getUser().getNickname())
            .createdAt(article.getCreatedAt())
            .commentCount(article.getCommentCount())
            .build()
            ;
    }
}
