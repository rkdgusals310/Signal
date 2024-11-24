package com.signal.domain.chatting.repository;

import com.signal.domain.chatting.model.ChattingMessages;

import io.lettuce.core.dynamic.annotation.Param;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChattingMessagesRepository extends JpaRepository<ChattingMessages, Long> {
    List<ChattingMessages> findByChattingRoomIdAndIsReadFalse(Long roomId);
    
    @Query("SELECT m FROM ChattingMessages m WHERE m.chattingRoom.id = :roomId AND m.id > :cursor ORDER BY m.id ASC")
    List<ChattingMessages> findMessagesByRoomIdWithCursor(@Param("roomId") Long roomId, @Param("cursor") Long cursor, Pageable pageable);
}
