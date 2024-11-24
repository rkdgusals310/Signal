package com.signal.domain.chatting.dto.response;

import java.util.List;

import com.signal.domain.auth.model.enums.Role;
import com.signal.domain.chatting.model.ChattingMessages;
import com.signal.domain.chatting.model.ChattingRoom;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ChattingRoomWithMessagesResponse {
    private Long roomId;
    private String otherPartyName; 
    private String title;          
    private List<ChattingMessageResponse> messages;
    private Long nextCursor;
    private boolean hasNext; // 추가된 필드

    public ChattingRoomWithMessagesResponse(ChattingRoom room, List<ChattingMessages> messages, Role role, Long nextCursor) {
        this.roomId = room.getId();

        // 상대방 이름과 제목 설정
        if (role == Role.USER) {
            this.otherPartyName = room.getConsultant().getNickname();
            this.title = room.getConsultant().getNickname() + " 상담사와의 상담방";
        } else if (role == Role.CONSULTANT) {
            this.otherPartyName = room.getUser().getNickname();
            this.title = room.getUser().getNickname() + " 사용자의 상담방";
        }

        // 메시지 변환 및 커서 설정
        this.messages = messages.stream()
                                 .map(ChattingMessageResponse::new)
                                 .toList();
        this.nextCursor = nextCursor;
        this.hasNext = hasNext;
    }

}
