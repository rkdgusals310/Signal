package com.signal.domain.likes.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class MyLikesResponse {

    private int totalCount;
    private List<LikeResponse> myLikes;

    public static MyLikesResponse toDto(int totalCount, List<LikeResponse> myLikes) {
        return MyLikesResponse.builder()
            .totalCount(totalCount)
            .myLikes(myLikes)
            .build()
            ;
    }
}
