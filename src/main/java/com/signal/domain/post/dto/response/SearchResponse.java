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
public class SearchResponse {

    private int totalCount;
    private List<PostResponse> posts;

    public static SearchResponse toDto (
        int totalCount,
        List<PostResponse> posts
    ) {
        return SearchResponse.builder()
            .totalCount(totalCount)
            .posts(posts)
            .build()
            ;
    }
}
