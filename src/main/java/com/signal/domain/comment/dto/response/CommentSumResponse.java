package com.signal.domain.comment.dto.response;

import java.time.LocalDateTime;

import com.signal.domain.article.model.Article;
import com.signal.domain.comment.model.Comment;
import com.signal.domain.likes.dto.LikeResponse;
import com.signal.domain.likes.model.enums.Type;
import com.signal.domain.post.model.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentSumResponse {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private Type type;

    public static CommentSumResponse toDto(Article article, Comment comment) {
        return CommentSumResponse.builder()
            .id(article.getId())
            .title(article.getTitle())
            .content(comment.getContents())
            .createdAt(comment.getCreatedAt())
            .type(Type.ARTICLE)
            .build()
            ;
    }

    public static CommentSumResponse toDto(Post post, Comment comment) {
        return CommentSumResponse.builder()
            .id(post.getId())
            .title(post.getTitle())
            .content(comment.getContents())
            .createdAt(comment.getCreatedAt())
            .type(Type.POST)
            .build()
            ;

    }
}
