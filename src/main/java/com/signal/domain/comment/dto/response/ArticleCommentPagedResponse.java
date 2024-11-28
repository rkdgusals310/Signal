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
public class ArticleCommentPagedResponse {
	private List<ArticleCommentResponse> comments;
	private int repliesCount;
	private Long nextCursorId; // 다음 커서로 사용할 마지막 댓글 ID
	private boolean hasNext; // 다음 페이지가 있는지 여부
	

	 public static ArticleCommentPagedResponse toDto(List<ArticleCommentResponse> comments, int repliesCount, Long nextCursorId, boolean hasNext) {
	        return ArticleCommentPagedResponse.builder()
	            .comments(comments)
	            .repliesCount(repliesCount)
	            .nextCursorId(nextCursorId)
	            .hasNext(hasNext)
	            .build();
	    }

	public ArticleCommentPagedResponse withRepliesCount(int repliesCount) {
		this.repliesCount = repliesCount;
		return this;
	}

}
