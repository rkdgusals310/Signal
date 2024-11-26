package com.signal.domain.review.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewCreateRequest {
	
	@NotBlank(message = "댓글 내용은 비어 있을 수 없습니다.")
	private String content;
	
	private Double rating;
	
}
