package com.signal.global.exception.errorCode;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public enum ErrorCode {
    //Common
    BAD_REQUEST(HttpStatus.BAD_REQUEST.value(), "400", "요청 파라미터나, 요청 바디의 값을 다시 확인하세요"),
    NOT_FOUND(HttpStatus.NOT_FOUND.value(), "404", "잘못된 요청입니다."),


    //Authentication Errors
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED.value(), "401", "로그인이 필요합니다."),
    USER_NOT_FOUND(HttpStatus.BAD_REQUEST.value(), "402", "올바르지 않는 사용자 ID 입니다."),
    DUPLICATE_EMAIL(HttpStatus.BAD_REQUEST.value(), "403", "이미 가입된 이메일입니다."),
    INVALID_VERIFICATION_CODE(HttpStatus.BAD_REQUEST.value(), "404", "잘못된 인증 번호입니다."),
    INVALID_VERIFY(HttpStatus.BAD_REQUEST.value(), "405", "이메일 인증이 필요합니다."),
    INVALID_LOGIN_INFORMATION(HttpStatus.BAD_REQUEST.value(), "406", "아이디 및 비밀번호가 틀렸습니다."),

    //AUTH
    NOT_LOGGED_IN(HttpStatus.UNAUTHORIZED.value(), "A001", "로그인이 필요합니다."),

    //POST
    CONTENT_TOO_SHORT(HttpStatus.BAD_REQUEST.value(), "P001", "내용은 최소 10자 이상이어야 합니다."),
    TITLE_TOO_SHORT_OR_LONG(HttpStatus.BAD_REQUEST.value(), "P002", "제목의 길이는 5자이상 20자 이하여야합니다."),
    POST_NOT_FOUND(HttpStatus.BAD_REQUEST.value(), "P003", "올바르지 않는 게시글 아이디 입니다."),
    WRONG_ROLE_POST(HttpStatus.UNAUTHORIZED.value(), "P004", "상담사는 게시글을 작성할 수 없습니다."),

    //ARTICLE
    ARTICLE_NOT_FOUND(HttpStatus.BAD_REQUEST.value(), "R001", "올바르지 않는 아티클 아이디 입니다."),
    WRONG_ROLE_ARTICLE(HttpStatus.UNAUTHORIZED.value(), "R002", "일반 사용자는 아티클을 작성할 수 없습니다."),

    ;
    private final Integer status;
    private final String code;
    private final String message;

}

