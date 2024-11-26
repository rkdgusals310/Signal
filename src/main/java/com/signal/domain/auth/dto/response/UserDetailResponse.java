package com.signal.domain.auth.dto.response;

import com.signal.domain.auth.model.User;
import com.signal.domain.auth.model.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserDetailResponse {

    private Long id;
    private String image;
    private String userId;
    private String email;
    private String nickname;
    private Gender gender;

    public static UserDetailResponse toDto(User user) {
        return UserDetailResponse.builder()
            .id(user.getId())
            .image(user.getImage())
            .userId(user.getUserId())
            .email(user.getEmail())
            .nickname(user.getNickname())
            .gender(user.getGender())
            .build()
            ;
    }
}
