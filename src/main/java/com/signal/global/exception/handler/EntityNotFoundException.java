package com.signal.global.exception.handler;

import com.signal.global.exception.errorCode.ErrorCode;

public class EntityNotFoundException extends CustomException{

    public EntityNotFoundException(ErrorCode errorCode) {
        super(errorCode);
    }
}
