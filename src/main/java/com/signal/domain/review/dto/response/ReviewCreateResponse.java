package com.signal.domain.review.dto.response;

import java.time.LocalDateTime;

import com.signal.domain.auth.model.enums.Gender;
import com.signal.domain.comment.dto.response.CommentResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewCreateResponse {
	private String consultantName;
	private String keyword;
	private String profileImage;
	
}
