package com.signal.domain.chatting.controller;

import com.signal.domain.auth.model.enums.Role;

import com.signal.domain.chatting.dto.request.ChattingMessageRequest;
import com.signal.domain.chatting.dto.request.ChattingRoomRequest;
import com.signal.domain.chatting.dto.response.ChattingMessageResponse;

import com.signal.domain.chatting.dto.response.ChattingRoomWithMessagesResponse;
import com.signal.domain.chatting.model.ChattingMessages;
import com.signal.domain.chatting.model.ChattingRoom;
import com.signal.domain.chatting.model.enums.ChattingRoomStatus;
import com.signal.domain.chatting.service.ChattingService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth/chat")
@Tag(name = "Chat", description = "채팅")
public class ChattingController {

    private final ChattingService chattingService;

    public ChattingController(ChattingService chattingService) {
        this.chattingService = chattingService;
    }

    @Operation(summary = "상담방 생성")
    @PostMapping("/room")
    public ChattingRoomWithMessagesResponse createRoom(@RequestBody ChattingRoomRequest request) {
        ChattingRoom room = chattingService.getOrCreateRoom(request);
        return ChattingRoomWithMessagesResponse.builder()
            .roomId(room.getId())
            .otherPartyName(room.getConsultant().getNickname())
            .title(room.getConsultant().getNickname() + " 상담사와의 상담방")
            .messages(List.of()) // 빈 메시지 리스트
            .nextCursor(null) // 초기 상태에서는 커서 없음
            .build();
    }


    @Operation(summary = "메시지 전송")
    @PostMapping("/message")
    public void sendMessage(@RequestBody ChattingMessageRequest request) {
        chattingService.sendMessage(request);
    }

    
    @Operation(summary = "방 정보와 메시지 조회 (커서 페이지네이션)")
    @GetMapping("/room/{roomId}/details")
    public ChattingRoomWithMessagesResponse getRoomDetails(
            @PathVariable Long roomId,
            @RequestParam(defaultValue = "20") int size, 
            @RequestParam(required = false) Long cursor,
            @RequestParam Role role
          
            
    ) {
        return chattingService.getRoomWithMessages(roomId,cursor, size,role);
    }
}
