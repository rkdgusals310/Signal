package com.signal.domain.comment.dto.response;

import java.time.LocalDateTime;
import java.util.List;

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
	private List<CommentResponse> comments;
	private int repliesCount;
	private Long nextCursorId; // 다음 커서로 사용할 마지막 댓글 ID
	private boolean hasNext; // 다음 페이지가 있는지 여부
	

	 public static CommentPagedResponse toDto(List<CommentResponse> comments, int repliesCount, Long nextCursorId, boolean hasNext) {
	        return CommentPagedResponse.builder()
	            .comments(comments)
	            .repliesCount(repliesCount)
	            .nextCursorId(nextCursorId)
	            .hasNext(hasNext)
	            .build();
	    }

	public CommentPagedResponse withRepliesCount(int repliesCount) {
		this.repliesCount = repliesCount;
		return this;
	}

}
