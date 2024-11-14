package com.signal.domain.likes.dto;

import com.signal.domain.article.model.Article;
import com.signal.domain.likes.model.enums.Type;
import com.signal.domain.post.model.Post;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class LikeResponse {

    private Long id;
    private String title;
    private LocalDateTime createdAt;
    private Long likesCount;
    private Long viewCount;
    private Type type;

    public static LikeResponse toDto(Article article) {
        return LikeResponse.builder()
                .id(article.getId())
                .title(article.getTitle())
                .createdAt(article.getCreatedAt())
                .likesCount(article.getLikesCount())
                .viewCount(article.getViewCount())
                .type(Type.ARTICLE)
                .build()
                ;
    }

    public static LikeResponse toDto(Post post) {
        return LikeResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .createdAt(post.getCreatedAt())
                .likesCount(post.getLikesCount())
                .viewCount(post.getViewCount())
                .type(Type.POST)
                .build()
                ;

    }
}
