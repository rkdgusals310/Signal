package com.signal.global.exception.handler;

import com.signal.global.exception.errorCode.ErrorCode;

public class AccessDeniedException extends CustomException{

    public AccessDeniedException(ErrorCode errorCode) {
        super(errorCode);
    }
}
