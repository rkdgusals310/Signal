package com.signal.domain.auth.dto.response;

import com.signal.domain.auth.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FindIdResponse {

    private String userId;

    public static FindIdResponse toDto(User user) {
        return FindIdResponse.builder()
            .userId(user.getUserId())
            .build()
            ;
    }
}
