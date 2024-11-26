package com.signal.domain.likes.model;

import com.signal.domain.article.model.Article;
import com.signal.domain.auth.model.User;
import com.signal.domain.post.model.Post;
import com.signal.global.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Table(name = "likes")
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Likes extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne
    @JoinColumn(name = "article_id")
    private Article article;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public static Likes createPostLike(Post post, User user) {
        return Likes.builder()
            .post(post)
            .user(user)
            .createdAt(LocalDateTime.now())
            .build()
            ;
    }

    public static Likes createArticleLike(Article article, User user) {
        return Likes.builder()
            .article(article)
            .user(user)
            .createdAt(LocalDateTime.now())
            .build()
            ;
    }
}
