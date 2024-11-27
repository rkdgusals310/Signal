package com.signal.domain.review.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.signal.domain.auth.dto.response.ConsultantDetailResponse;
import com.signal.domain.auth.dto.response.ConsultantDetailReviewResponse;
import com.signal.domain.chatting.model.ChattingRoom;
import com.signal.domain.chatting.repository.ChattingRoomRepository;
import com.signal.domain.review.dto.request.ReviewCreateRequest;
import com.signal.domain.review.dto.response.ReviewResponse;
import com.signal.domain.review.model.Review;
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
	
	@GetMapping("/auth/chat/room/{roomId}/review-page")
	@Operation(summary="리뷰 작성 이동")
	public ReviewResponse getReviewPageUrl(
			@AuthenticationPrincipal CustomUserDetails customUserDetails,
			@PathVariable Long roomId
	) {

		ChattingRoom room=chattingRoomRepository.findById(roomId)
				.orElseThrow(() -> new IllegalArgumentException("Invalid room ID"));
		Long consultantId=room.getConsultant().getId();
		Long user=customUserDetails.getUserId();
		
		Double averageRating = reviewService.getAverageRatingByConsultantId(consultantId);
		int totalReviews = reviewService.countReviewsByConsultantId(consultantId);
		
		
		
		return ReviewResponse.builder()
				.profileImage(room.getConsultant().getImage())
				.consultantName(room.getConsultant().getNickname())
				.keyword(room.getConsultant().getKeyword())
				.style(room.getConsultant().getStyle())
				.averageRating(averageRating)
				.totalReviews(totalReviews)
				.build();
	
	}
	
	
	@PostMapping("/auth/chat/room/{roomId}/review")
	@Operation(summary="리뷰 작성")
	public void createReview(
			@RequestBody ReviewCreateRequest request,
			@AuthenticationPrincipal CustomUserDetails customUserDetails,
			@PathVariable Long roomId
	) {
		Long userId = customUserDetails.getUserId();
		ChattingRoom room=chattingRoomRepository.findById(roomId)
				.orElseThrow(() -> new IllegalArgumentException("Invalid room ID"));
		Long consultantId=room.getConsultant().getId();
		 
		reviewService.createReview(userId, consultantId, request);	
	}
	
	
	@GetMapping("/common/consultant/reviewDetail")
    @Operation(summary = "리뷰 조회")
    public ResponseEntity<ConsultantDetailReviewResponse> getReviewById(
    		@RequestParam("reviewId") Long reviewId
    ) {
		
        return ResponseEntity.ok(reviewService.getReviewById(reviewId));
    }
}
