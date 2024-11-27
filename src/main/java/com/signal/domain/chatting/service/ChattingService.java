package com.signal.domain.chatting.service;

import com.signal.domain.chatting.dto.request.ChattingMessageRequest;

import com.signal.domain.chatting.dto.request.ChattingRoomRequest;
import com.signal.domain.chatting.dto.response.ChattingListResponse;
import com.signal.domain.chatting.dto.response.ChattingMessageResponse;

import com.signal.domain.chatting.dto.response.ChattingResponse;
import com.signal.domain.chatting.dto.response.ChattingRoomWithMessagesResponse;
import com.signal.domain.chatting.model.ChattingMessages;
import com.signal.domain.chatting.model.ChattingRoom;
import com.signal.domain.chatting.model.enums.ChattingRoomStatus;
import com.signal.domain.chatting.repository.ChattingMessagesRepository;
import com.signal.domain.chatting.repository.ChattingRepository;
import com.signal.domain.chatting.repository.ChattingRoomRepository;

import com.signal.domain.review.model.Review;
import com.signal.domain.review.repository.ReviewRepository;
import com.signal.global.dto.PagedDto;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.signal.domain.article.repository.ArticleRepository;
import com.signal.domain.article.service.ArticleService;
import com.signal.domain.auth.model.User;
import com.signal.domain.auth.model.enums.Role;
import com.signal.domain.auth.repository.AuthRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class ChattingService {

    private final ChattingRoomRepository chattingRoomRepository;
    private final ChattingMessagesRepository chattingMessagesRepository;
    private final AuthRepository authRepository;
    private final ChattingRepository chattingRepository;
    private final ReviewRepository reviewRepository;

    @Transactional
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
            .createdAt(LocalDateTime.now())
            .lastActivityAt(LocalDateTime.now())
            .completedAt(null)
            .build();

        return chattingRoomRepository.save(room);
    });}
    
    @Transactional
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
            .createdAt(LocalDateTime.now())
            .build();
        ChattingMessages savedMessage = chattingMessagesRepository.save(message);
        chattingRoomRepository.updateLastActivityAt(request.getRoomId(), LocalDateTime.now());
        return savedMessage;
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
        Long userId;
        if (role == Role.USER) {
            otherPartyName = room.getConsultant().getNickname();
            title = room.getConsultant().getNickname() + " 상담사와의 상담방";
            userId=room.getConsultant().getId();
        } else if (role == Role.CONSULTANT) {
            otherPartyName = room.getUser().getNickname();
            title = room.getUser().getNickname() + " 사용자의 상담방";
            userId=room.getUser().getId();
        } else {
            throw new IllegalArgumentException("Invalid role");
        }

        return new ChattingRoomWithMessagesResponse(
            room.getId(),
            title,
            otherPartyName,
            messageResponses,
            nextCursor,
            hasNext,
            room.getLastActivityAt(),
            userId
        );
    }
    
    @Transactional
	public void completeChattingRoom(Long roomId) {
		ChattingRoom room=chattingRoomRepository.findById(roomId)
				.orElseThrow(()->new IllegalArgumentException("Invalid room ID"));
		
		room.setStatus(ChattingRoomStatus.COMPLETED);
		room.setCompletedAt(LocalDateTime.now());
		chattingRoomRepository.save(room);
	}

    public PagedDto<ChattingResponse> getUserChattingResponse (int page, int size, Long userId) {
        authRepository.existsUserById(userId);

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Direction.DESC, "lastActivityAt"));

        Page<ChattingRoom> userChattingRooms = chattingRepository.findByUserId(userId, pageRequest);

        List<ChattingListResponse> chattingListResponses = userChattingRooms.stream()
            .map( userChattingRoom -> {
                Review review = reviewRepository.findByChattingRoomId(userChattingRoom.getId());
                return ChattingListResponse.toDto(userChattingRoom, review, Role.USER);
            }).collect(Collectors.toList());

        int totalCount = (int) userChattingRooms.getTotalElements();
        int totalPages = (totalCount + size - 1) / size;

        ChattingResponse chattingResponse = ChattingResponse.toDto(totalCount, chattingListResponses);

        return PagedDto.toDTO(page, size, totalPages, List.of(chattingResponse));
    }

    public PagedDto<ChattingResponse> getConsultantChattingResponse (int page, int size, Long consultantId) {
        authRepository.existsConsultantById(consultantId);

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Direction.DESC, "lastActivityAt"));

        Page<ChattingRoom> userChattingRooms = chattingRepository.findByConsultantId(consultantId, pageRequest);

        List<ChattingListResponse> chattingListResponses = userChattingRooms.stream()
            .map( userChattingRoom -> {
                Review review = reviewRepository.findByChattingRoomId(userChattingRoom.getId());
                return ChattingListResponse.toDto(userChattingRoom, review, Role.CONSULTANT);
            }).collect(Collectors.toList());

        int totalCount = (int) userChattingRooms.getTotalElements();
        int totalPages = (totalCount + size - 1) / size;

        ChattingResponse chattingResponse = ChattingResponse.toDto(totalCount, chattingListResponses);

        return PagedDto.toDTO(page, size, totalPages, List.of(chattingResponse));
    }
}
