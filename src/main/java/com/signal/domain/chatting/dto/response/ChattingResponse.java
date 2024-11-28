package com.signal.domain.chatting.dto.response;

import com.signal.domain.auth.model.enums.Role;
import com.signal.domain.chatting.model.ChattingRoom;
import com.signal.domain.chatting.model.enums.ChattingRoomStatus;
import com.signal.domain.review.model.Review;
import java.time.LocalDate;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class ChattingResponse {

    private int totalCount;
    private List<ChattingListResponse> myChatting;

    public static ChattingResponse toDto(int totalCount, List<ChattingListResponse> myChatting) {
        return ChattingResponse.builder()
            .totalCount(totalCount)
            .myChatting(myChatting)
            .build()
            ;
    }
}
