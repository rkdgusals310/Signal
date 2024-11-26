package com.signal.domain.comment.dto.response;

import java.time.LocalDateTime;

import com.signal.domain.auth.model.User;
import com.signal.domain.auth.model.enums.Gender;
import com.signal.domain.comment.model.Comment;
import com.signal.domain.post.dto.response.PostDetailResponse;
import com.signal.domain.post.model.Post;
import com.signal.domain.post.model.enums.Category;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentResponse {
	private Long id;
	private Long postId;
	private Gender gender;
	private String contents;
	private LocalDateTime createdAt;
	private Long userId;

	
	public static CommentResponse toDto(Comment comment) {
		return CommentResponse.builder()
				.id(comment.getId())
				.postId(comment.getPost().getId())
				.gender(comment.getUser().getGender())
				.contents(comment.getContents())
				.createdAt(comment.getCreatedAt())
				.userId(comment.getUser().getId())
				.build();
		
	}
}
