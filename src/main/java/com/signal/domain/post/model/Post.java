package com.signal.domain.post.model;

import com.signal.domain.auth.model.User;

import com.signal.domain.post.dto.request.PostRequest;
import com.signal.domain.post.model.enums.Category;
import com.signal.global.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Getter
@Table(name = "post")
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Post extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String contents;

    @Column(nullable = false)
    private Long viewCount;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Category category;

    @Column(nullable = false)
    private Long likesCount;

    @Column(nullable = false)
    private Long commentCount;

    @LastModifiedDate
    @Column(name = "modified_at")
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime modifiedAt;

    private LocalDateTime deletedAt;

    public static Post toEntity(PostRequest postRequest, User user) {
        return Post.builder()
            .user(user)
            .title(postRequest.getTitle())
            .contents(postRequest.getContents())
            .viewCount(0L)
            .category(postRequest.getCategory())
            .likesCount(0L)
            .commentCount(0L)
            .createdAt(LocalDateTime.now())
            .build()
            ;
    }

    public void update(PostRequest postRequest) {
        this.title = postRequest.getTitle();
        this.contents = postRequest.getContents();
        this.category = postRequest.getCategory();
    }
}
