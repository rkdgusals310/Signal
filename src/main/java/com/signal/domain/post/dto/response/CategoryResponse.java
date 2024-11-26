package com.signal.domain.post.dto.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponse {

    private int totalCount;
    private PostResponse hotPost;
    private List<PostResponse> posts;

    public static CategoryResponse toDto (
        int totalCount,
        PostResponse hotPost,
        List<PostResponse> posts
    ) {
        return CategoryResponse.builder()
            .totalCount(totalCount)
            .hotPost(hotPost)
            .posts(posts)
            .build()
            ;
    }
}
