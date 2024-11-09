package com.signal.domain.comment.dto.resquest;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentCreateRequest {
	@NotNull(message="게시물 ID는 필수입니다.")
	private Long postId;
	
//	@NotNull(message="사용자 ID는 필수입니다.")
//	private Long userId;
	
	@NotBlank(message = "댓글 내용은 비어 있을 수 없습니다.")
	private String contents;
}
