package com.signal.domain.post.dto.response;

import com.signal.domain.post.model.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HotPostResponse {

    private Long id;
    private String title;
    private String contents;

    public static HotPostResponse toDto(Post post) {
        return HotPostResponse.builder()
            .id(post.getId())
            .title(post.getTitle())
            .contents(post.getContents())
            .build()
            ;
    }
}
