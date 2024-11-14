package com.signal.domain.comment.dto.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class MyCommentResponse {

    private int totalCount;
    private List<CommentSumResponse> myComment;

    public static MyCommentResponse toDto(int totalCount, List<CommentSumResponse> myComment) {
        return MyCommentResponse.builder()
            .totalCount(totalCount)
            .myComment(myComment)
            .build()
            ;
    }
}
