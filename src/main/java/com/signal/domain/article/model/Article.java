package com.signal.domain.article.model;

import com.signal.domain.article.dto.request.ArticleRequest;
import com.signal.domain.auth.model.User;
import com.signal.global.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.LastModifiedDate;

@Entity
@Table(name = "article")
@Getter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Article extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String contents;

    @Column(nullable = false)
    private Long viewCount;

    @Column(nullable = false)
    private Long likesCount;

    @Column(nullable = false)
    private Long commentCount;

    private LocalDateTime deletedAt;

    @LastModifiedDate
    @Column(name = "modified_at")
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime modifiedAt;

    @Column(nullable = false)
    private String thumbnail;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public static Article toEntity(ArticleRequest articleRequest, User user) {
        return Article.builder()
            .title(articleRequest.getTitle())
            .contents(articleRequest.getContent())
            .viewCount(0L)
            .likesCount(0l)
            .commentCount(0L)
            .thumbnail(articleRequest.getThumbnail())
            .user(user)
            .build()
            ;
    }

    public void update(ArticleRequest articleRequest) {
        this.title = articleRequest.getTitle();
        this.contents = articleRequest.getContent();
        this.thumbnail = articleRequest.getThumbnail();
    }
}
