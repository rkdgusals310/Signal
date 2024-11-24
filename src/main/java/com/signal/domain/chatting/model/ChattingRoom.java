package com.signal.domain.chatting.model;

import com.signal.domain.auth.model.User;
import com.signal.domain.chatting.model.enums.ChattingRoomStatus;
import com.signal.global.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "chatting_room")
@Getter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class ChattingRoom extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "consultant_id", nullable = false)
    private User consultant;

    private LocalDateTime completedAt;
    
    @Enumerated(EnumType.STRING)
    private ChattingRoomStatus status; 
}
