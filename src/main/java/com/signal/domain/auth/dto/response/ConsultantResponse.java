package com.signal.domain.auth.dto.response;

import com.signal.domain.auth.model.User;
import com.signal.domain.auth.model.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultantResponse {

    private Long id;
    private String name;
    private Gender gender;
    private String keyword;
    private String image;
    private Double totalRating;
    private int chattingCount;

    public static ConsultantResponse toDto(User user, int chattingCount) {
        return ConsultantResponse.builder()
            .id(user.getId())
            .name(user.getNickname())
            .gender(user.getGender())
            .keyword(user.getKeyword())
            .image(user.getImage())
            .totalRating(user.getTotalRating())
            .chattingCount(chattingCount)
            .build()
            ;
    }
}
