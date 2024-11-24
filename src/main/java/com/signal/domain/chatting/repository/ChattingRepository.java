package com.signal.domain.chatting.repository;

import com.signal.domain.chatting.model.ChattingRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChattingRepository extends JpaRepository<ChattingRoom, Long> {

    @Query("SELECT COUNT(cr) FROM ChattingRoom cr WHERE cr.consultant.id = :consultantId")
    int countByConsultant(@Param("consultantId") Long consultantId);
}
