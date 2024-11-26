package com.signal.domain.chatting.repository;

import com.signal.domain.chatting.model.ChattingRoom;
import com.signal.domain.chatting.model.enums.ChattingRoomStatus;

import io.lettuce.core.dynamic.annotation.Param;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ChattingRoomRepository extends JpaRepository<ChattingRoom, Long> {
    List<ChattingRoom> findByStatus(ChattingRoomStatus status);
    Optional<ChattingRoom> findByUserIdAndConsultantIdAndStatus(Long userId, Long consultantId, ChattingRoomStatus status);
    
    @Modifying
    @Query("UPDATE ChattingRoom c SET c.lastActivityAt = :lastActivityAt WHERE c.id = :roomId")
    void updateLastActivityAt(@Param("roomId") Long roomId, @Param("lastActivityAt") LocalDateTime lastActivityAt);

}