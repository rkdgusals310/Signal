package com.signal.domain.chatting.controller;

import com.signal.domain.auth.model.enums.Role;

import com.signal.domain.chatting.dto.request.ChattingMessageRequest;
import com.signal.domain.chatting.dto.request.ChattingRoomRequest;
import com.signal.domain.chatting.dto.response.ChattingMessageResponse;

import com.signal.domain.chatting.dto.response.ChattingResponse;
import com.signal.domain.chatting.dto.response.ChattingRoomWithMessagesResponse;
import com.signal.domain.chatting.model.ChattingMessages;
import com.signal.domain.chatting.model.ChattingRoom;
import com.signal.domain.chatting.model.enums.ChattingRoomStatus;
import com.signal.domain.chatting.service.ChattingService;

import com.signal.global.dto.PagedDto;
import com.signal.global.sercurity.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@Tag(name = "Chat", description = "채팅")
public class ChattingController {

    private final ChattingService chattingService;

    public ChattingController(ChattingService chattingService) {
        this.chattingService = chattingService;
    }

    @Operation(summary = "채팅방 생성")
    @PostMapping("/auth/chat/room")
    public ChattingRoomWithMessagesResponse createRoom(@RequestBody ChattingRoomRequest request) {
        ChattingRoom room = chattingService.getOrCreateRoom(request);
        return ChattingRoomWithMessagesResponse.builder()
            .roomId(room.getId())
            .otherPartyName(room.getConsultant().getNickname())
            .title(room.getConsultant().getNickname() + " 상담사와의 상담방")
            .messages(List.of()) // 빈 메시지 리스트
            .nextCursor(null) // 초기 상태에서는 커서 없음
            .lastActivityAt(room.getLastActivityAt())
            .build();
    }

	@Operation(summary = "채팅 종료")
	@PutMapping("/auth/chat/room/{roomId}/status")
	public void updateRoomStatus(@PathVariable Long roomId) {
		chattingService.completeChattingRoom(roomId);
	}


    @Operation(summary = "메시지 전송")
    @PostMapping("/auth/chat/message")
    public ChattingMessageResponse sendMessage(@RequestBody ChattingMessageRequest request) {
        ChattingMessages messages=chattingService.sendMessage(request);
		return ChattingMessageResponse.builder()
				.messageId(messages.getId())
				.message(messages.getMessage())
				.senderName(messages.getUserId().getNickname())
				.sentAt(messages.getCreatedAt())
				.lastActivityAt(messages.getChattingRoom().getLastActivityAt())
				.senderId(messages.getUserId().getId())
				.build();
    }

    
    @Operation(summary = "방 정보와 메시지 조회 (커서 페이지네이션)")
    @GetMapping("/auth/chat/room/{roomId}/details")
    public ChattingRoomWithMessagesResponse getRoomDetails(
            @PathVariable Long roomId,
            @RequestParam(defaultValue = "20") int size, 
            @RequestParam(required = false) Long cursor,
            @RequestParam Role role
          
            
    ) {
        return chattingService.getRoomWithMessages(roomId,cursor, size,role);
    }

    @Operation(summary = "일반 사용자 상담 내역 확인")
    @GetMapping("/user/my-chatting")
    public ResponseEntity<PagedDto<ChattingResponse>> getUserChattingResponse (
        @RequestParam(required = false, value = "size", defaultValue = "10") int size,
        @RequestParam(required = false, value = "page", defaultValue = "0") int page,
        @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {
        Long userId = customUserDetails.getUserId();
        PagedDto<ChattingResponse> response = chattingService.getUserChattingResponse(page, size, userId);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "상담사 상담 내역 확인")
    @GetMapping("/consultant/my-chatting")
    public ResponseEntity<PagedDto<ChattingResponse>> getConsultantChattingResponse (
        @RequestParam(required = false, value = "size", defaultValue = "10") int size,
        @RequestParam(required = false, value = "page", defaultValue = "0") int page,
        @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {
        Long userId = customUserDetails.getUserId();
        PagedDto<ChattingResponse> response = chattingService.getConsultantChattingResponse(page, size, userId);

        return ResponseEntity.ok(response);
    }
}
