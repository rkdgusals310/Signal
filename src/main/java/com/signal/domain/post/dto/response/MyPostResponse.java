package com.signal.domain.post.dto.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class MyPostResponse {

    private int totalCount;
    private List<PostResponse> myPost;

    public static MyPostResponse toDto(
        int totalCount,
        List<PostResponse> myPost
    ) {
        return MyPostResponse.builder()
            .totalCount(totalCount)
            .myPost(myPost)
            .build()
            ;
    }
}
