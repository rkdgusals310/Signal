package com.signal.domain.chatting.model;

import com.signal.domain.auth.model.User;
import com.signal.global.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "chatting_messages")
@Getter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class ChattingMessages extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private ChattingRoom chattingRoom;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User userId;

    @Column(nullable = false)
    private String message;
    
    @Column(nullable = false)
    private boolean isRead;
    
    
}
