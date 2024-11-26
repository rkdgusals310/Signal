package com.signal.global.exception.handler;

import com.signal.global.exception.errorCode.ErrorCode;

public class CustomIllegalArgumentException extends CustomException{

    public CustomIllegalArgumentException(ErrorCode errorCode) {
        super(errorCode);
    }
}
