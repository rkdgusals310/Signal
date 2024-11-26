package com.signal.domain.review.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.signal.domain.chatting.model.ChattingRoom;
import com.signal.domain.chatting.repository.ChattingRoomRepository;
import com.signal.domain.review.dto.request.ReviewCreateRequest;
import com.signal.domain.review.dto.response.ReviewCreateResponse;
import com.signal.domain.review.service.ReviewService;
import com.signal.global.sercurity.CustomUserDetails;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api")
@Tag(name = "review", description = "리뷰")
public class ReviewController {
	
	private final ReviewService reviewService;
	private final ChattingRoomRepository chattingRoomRepository;
	
	@PostMapping("/auth/chat/room/{roomId}/review")
	@Operation(summary="리뷰 작성")
	public ReviewCreateResponse createReview(
			@RequestBody ReviewCreateRequest request,
			@AuthenticationPrincipal CustomUserDetails customUserDetails,
			@PathVariable Long roomId
	) {
		Long userId = customUserDetails.getUserId();
		ChattingRoom room=chattingRoomRepository.findById(roomId)
				.orElseThrow(() -> new IllegalArgumentException("Invalid room ID"));
		Long consultantId=room.getConsultant().getId();
		 
		reviewService.createReview(userId, consultantId, request);
		return ReviewCreateResponse.builder()
				.consultantName(room.getConsultant().getNickname())
				.keyword(room.getConsultant().getKeyword())
				.profileImage(room.getConsultant().getProfile())
				.build();
		
	}
}
