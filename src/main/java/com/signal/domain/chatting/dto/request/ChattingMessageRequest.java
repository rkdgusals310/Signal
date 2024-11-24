package com.signal.domain.chatting.dto.request;

import com.signal.domain.article.dto.request.ArticleRequest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChattingMessageRequest {
    private Long roomId;    
    private Long senderId;  
    private String message; 

   
}
