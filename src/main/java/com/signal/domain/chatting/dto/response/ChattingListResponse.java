package com.signal.domain.chatting.dto.response;

import com.signal.domain.auth.model.enums.Role;
import com.signal.domain.chatting.model.ChattingRoom;
import com.signal.domain.chatting.model.enums.ChattingRoomStatus;
import com.signal.domain.review.model.Review;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class ChattingListResponse {

    private Long id;
    private String other;
    private LocalDate lastActivityAt;
    private ChattingRoomStatus status;
//    private Long reviewId;

    public static ChattingListResponse toDto(ChattingRoom chattingRoom, Role role) {
        if (role == Role.CONSULTANT) {
            return ChattingListResponse.builder()
                .id(chattingRoom.getId())
                .other(chattingRoom.getUser().getNickname())
                .lastActivityAt(LocalDate.from(chattingRoom.getLastActivityAt()))
                .status(chattingRoom.getStatus())
//                .reviewId(review.getId())
                .build()
                ;
        } else {
            return ChattingListResponse.builder()
                .id(chattingRoom.getId())
                .other(chattingRoom.getConsultant().getNickname())
                .lastActivityAt(LocalDate.from(chattingRoom.getLastActivityAt()))
                .status(chattingRoom.getStatus())
//                .reviewId(review.getId())
                .build()
                ;
        }
    }
}
