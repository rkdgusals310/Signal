package com.signal.domain.post.dto.response;

import com.signal.domain.post.model.Post;
import com.signal.domain.post.model.enums.Category;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDetailResponse {
    private Long id;
    private Long userId;
    private String title;
    private String contents;
    private Category category;
    private LocalDateTime createdAt;
    private Long likeCount;
    private Long commentCount;

    //Post 엔티티를 PostDetailResponse로 변환하는 메서드
    public static PostDetailResponse toDto(Post post){
        return PostDetailResponse.builder()
            .id(post.getId())
            .userId(post.getUser().getId())
            .title(post.getTitle())
            .contents(post.getContents())
            .category(post.getCategory())
            .createdAt(post.getCreatedAt())
            .likeCount(post.getLikesCount())
            .commentCount(post.getCommentCount())
            .build();
    }

}
