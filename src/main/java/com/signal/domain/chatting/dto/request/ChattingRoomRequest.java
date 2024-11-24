package com.signal.domain.chatting.dto.request;

import com.signal.domain.article.dto.request.ArticleRequest;
import com.signal.domain.chatting.model.enums.ChattingRoomStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChattingRoomRequest {
    private Long userId;       
    private Long consultantId;  
  
    
}
