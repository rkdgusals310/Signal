package com.signal.domain.chatting.repository;

import com.signal.domain.chatting.model.ChattingRoom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChattingRepository extends JpaRepository<ChattingRoom, Long> {

    @Query("SELECT COUNT(cr) FROM ChattingRoom cr WHERE cr.consultant.id = :consultantId")
    int countByConsultant(@Param("consultantId") Long consultantId);

    @Query("SELECT cr FROM ChattingRoom cr WHERE cr.user.id = :userId")
    Page<ChattingRoom> findByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT cr FROM ChattingRoom cr WHERE cr.consultant.id = :consultantId")
    Page<ChattingRoom> findByConsultantId(@Param("consultantId") Long consultantId, Pageable pageable);
}
