package com.signal.domain.article.dto.response;

import com.signal.domain.article.model.Article;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import net.bytebuddy.asm.Advice.Local;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArticleDetailResponse {

    private String thumbnail;
    private String title;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
    private Long userId;
    private String userName;
    private String contents;

    public static ArticleDetailResponse toDto(Article article) {
        return ArticleDetailResponse.builder()
            .thumbnail(article.getThumbnail())
            .title(article.getTitle())
            .createdAt(article.getCreatedAt())
            .modifiedAt(article.getModifiedAt())
            .userId(article.getUser().getId())
            .userName(article.getUser().getNickname())
            .contents(article.getContents())
            .build()
            ;
    }
}
