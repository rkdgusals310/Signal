package com.signal.domain.auth.dto.request;

import com.signal.domain.auth.model.enums.AvailableDays;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ConsultantUpdateRequest {

    private String nickname;
    private String image;
    private String keyword;
    private String profileImage;
    private String profile;
    private AvailableDays availableDays;
    private String certifiedQualification;
    private String experience;
}
