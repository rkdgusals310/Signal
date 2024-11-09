package com.signal.domain.comment.dto.response;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;

import com.signal.domain.auth.model.enums.Gender;
import com.signal.domain.comment.model.Comment;
import com.signal.global.dto.PagedDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentPagedResponse {
	private PagedDto<CommentResponse> conmments;
	private int repliesCount;      
	
	public static CommentPagedResponse toDto(Page<Comment> commentPage) {
	    // 바로 Page<CommentResponse>로 변환
	    return CommentPagedResponse.builder()
	        .conmments(PagedDto.toDTO(commentPage.map(CommentResponse::toDto)))  
	        .build();
	}
	
	public CommentPagedResponse withRepliesCount(int repliesCount) {
        this.repliesCount = repliesCount;
        return this;
    }

}
