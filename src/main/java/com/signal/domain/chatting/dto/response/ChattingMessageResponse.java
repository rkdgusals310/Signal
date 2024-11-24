package com.signal.domain.chatting.dto.response;

import java.time.LocalDateTime;

import com.signal.domain.chatting.dto.request.ChattingMessageRequest;
import com.signal.domain.chatting.model.ChattingMessages;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ChattingMessageResponse {
    private Long messageId;
    private String message;
    private String senderName;
    private LocalDateTime sentAt;

    public ChattingMessageResponse(ChattingMessages message) {
        this.messageId = message.getId();
        this.message = message.getMessage();
        this.senderName = message.getUserId().getNickname();
        this.sentAt = message.getCreatedAt();
    }
}
