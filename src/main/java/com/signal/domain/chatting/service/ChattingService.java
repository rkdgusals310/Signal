package com.signal.domain.chatting.service;

import com.signal.domain.chatting.dto.request.ChattingMessageRequest;

import com.signal.domain.chatting.dto.request.ChattingRoomRequest;
import com.signal.domain.chatting.dto.response.ChattingMessageResponse;

import com.signal.domain.chatting.dto.response.ChattingRoomWithMessagesResponse;
import com.signal.domain.chatting.model.ChattingMessages;
import com.signal.domain.chatting.model.ChattingRoom;
import com.signal.domain.chatting.model.enums.ChattingRoomStatus;
import com.signal.domain.chatting.repository.ChattingMessagesRepository;
import com.signal.domain.chatting.repository.ChattingRoomRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.signal.domain.article.repository.ArticleRepository;
import com.signal.domain.article.service.ArticleService;
import com.signal.domain.auth.model.User;
import com.signal.domain.auth.model.enums.Role;
import com.signal.domain.auth.repository.AuthRepository;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class ChattingService {

    private final ChattingRoomRepository chattingRoomRepository;
    private final ChattingMessagesRepository chattingMessagesRepository;
    private final AuthRepository authRepository;

    public ChattingRoom getOrCreateRoom(ChattingRoomRequest request) {
    	return chattingRoomRepository.findByUserIdAndConsultantIdAndStatus(request.getUserId(), request.getConsultantId(), ChattingRoomStatus.ACTIVE)
                .orElseGet(() -> {
        User user = authRepository.findById(request.getUserId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));
        User consultant = authRepository.findById(request.getConsultantId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid consultant ID"));

        ChattingRoom room = ChattingRoom.builder()
            .user(user)
            .consultant(consultant)
            .status(ChattingRoomStatus.ACTIVE)
            .build();

        return chattingRoomRepository.save(room);
    });}

    public ChattingMessages sendMessage(ChattingMessageRequest request) {
        ChattingRoom room = chattingRoomRepository.findById(request.getRoomId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid room ID"));
        User sender = authRepository.findById(request.getSenderId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid sender ID"));

        ChattingMessages message = ChattingMessages.builder()
            .chattingRoom(room)
            .userId(sender)
            .message(request.getMessage())
            .isRead(false)
            .build();

        return chattingMessagesRepository.save(message);
    }

    public List<ChattingRoom> getRoomsByStatus(ChattingRoomStatus status) {
        return chattingRoomRepository.findByStatus(status);
    }
    
    public ChattingRoomWithMessagesResponse getRoomWithMessages(Long roomId, Long cursor, int size, Role role) {
        ChattingRoom room = chattingRoomRepository.findById(roomId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid room ID"));

        Long effectiveCursor = (cursor == null) ? 0L : cursor;

        Pageable pageable = PageRequest.of(0, size);
        List<ChattingMessages> messages = chattingMessagesRepository.findMessagesByRoomIdWithCursor(roomId, effectiveCursor, pageable);

        Long nextCursor = (messages.size() == size) ? messages.get(messages.size() - 1).getId() : null;

        boolean hasNext = (nextCursor != null);

        List<ChattingMessageResponse> messageResponses = messages.stream()
            .map(ChattingMessageResponse::new)
            .toList();

        String otherPartyName;
        String title;
        if (role == Role.USER) {
            otherPartyName = room.getConsultant().getNickname();
            title = room.getConsultant().getNickname() + " 상담사와의 상담방";
        } else if (role == Role.CONSULTANT) {
            otherPartyName = room.getUser().getNickname();
            title = room.getUser().getNickname() + " 사용자의 상담방";
        } else {
            throw new IllegalArgumentException("Invalid role");
        }

        return new ChattingRoomWithMessagesResponse(
            room.getId(),
            title,
            otherPartyName,
            messageResponses,
            nextCursor,
            hasNext 
        );
    }

    
    
    
}
