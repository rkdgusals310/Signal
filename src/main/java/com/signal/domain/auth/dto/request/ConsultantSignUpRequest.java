package com.signal.domain.auth.dto.request;

import com.signal.domain.auth.model.enums.AvailableDays;
import com.signal.domain.auth.model.enums.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ConsultantSignUpRequest {

    @NotBlank
    private String userId;

    @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
    @Pattern(regexp="(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\\W)(?=\\S+$).{8,20}",
        message = "비밀번호는 영문 대,소문자와 숫자, 특수기호가 적어도 1개 이상씩 포함된 8자 ~ 20자의 비밀번호여야 합니다.")
    private String password;

    @NotBlank
    private String nickname;

    @NotBlank
    private LocalDate birthday;

    @NotBlank
    private Gender gender;

    @NotBlank(message = "이메일은 필수 입력 값입니다.")
    @Email(message = "이메일 형식에 맞지 않습니다.")
    private String email;

    @NotBlank
    private String image;

    @NotBlank
    private String keyword;

    @NotBlank
    private String style;

    @NotBlank
    private String profile;

    @NotBlank
    private String certifiedQualification;

    @NotBlank
    private String experience;

    @NotBlank
    private AvailableDays availableDays;
}
