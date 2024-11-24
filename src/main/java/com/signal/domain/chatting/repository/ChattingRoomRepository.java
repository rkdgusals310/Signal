package com.signal.domain.chatting.repository;

import com.signal.domain.chatting.model.ChattingRoom;
import com.signal.domain.chatting.model.enums.ChattingRoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChattingRoomRepository extends JpaRepository<ChattingRoom, Long> {
    List<ChattingRoom> findByStatus(ChattingRoomStatus status);
    Optional<ChattingRoom> findByUserIdAndConsultantIdAndStatus(Long userId, Long consultantId, ChattingRoomStatus status);
}