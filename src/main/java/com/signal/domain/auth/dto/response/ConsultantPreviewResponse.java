package com.signal.domain.auth.dto.response;

import com.signal.domain.auth.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultantPreviewResponse {

    private Long id;
    private String name;
    private String image;

    public static ConsultantPreviewResponse toDto(User user) {
        return ConsultantPreviewResponse.builder()
            .id(user.getId())
            .name(user.getNickname())
            .image(user.getImage())
            .build()
            ;
    }
}
