package com.signal.domain.review.service;

import java.text.DecimalFormat;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.signal.domain.auth.dto.response.ConsultantDetailReviewResponse;
import com.signal.domain.auth.model.User;
import com.signal.domain.auth.repository.AuthRepository;
import com.signal.domain.review.dto.request.ReviewCreateRequest;
import com.signal.domain.review.model.Review;
import com.signal.domain.review.repository.ReviewRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;



@Service
@Slf4j
@RequiredArgsConstructor
public class ReviewService {
	private final ReviewRepository reviewRepository;
	private final AuthRepository authRepository;
	
	public Double getAverageRatingByConsultantId(Long consultantId) {
		  Double averageRating = reviewRepository.calculateAverageRatingByConsultantId(consultantId);
		
		  return formatToDouble(averageRating,consultantId);
    }
	
	
	private Double formatToDouble(Double value,Long consultantId) {
		if (value == null) {
	        return 0.0;
	    }
		DecimalFormat df = new DecimalFormat("#.##");
		Double d=Double.valueOf(df.format(value));
		authRepository.updateTotalRating(consultantId, d);
	    return d;
	}
	public int countReviewsByConsultantId(Long consultantId) {
		return reviewRepository.countReviewsByConsultantId(consultantId);
		
	}

	@Transactional
	public void createReview(Long userId, Long consultantId,ReviewCreateRequest request) {
		User user=authRepository.findById(userId)
				.orElseThrow(()->new IllegalArgumentException("Invalid user ID"));
		
		User consultant =authRepository.findById(consultantId)
				.orElseThrow(()->new IllegalArgumentException("Invalid user ID"));

		Review review=Review.builder()
				.user(user)
				.consultant(consultant)
				.rating(request.getRating())
				.content(request.getContent())
				.createdAt(LocalDateTime.now())
				.modifiedAt(null)
				.build();

		Review savedReview =reviewRepository.save(review);
		
	}
	
	
	public ConsultantDetailReviewResponse getReviewById(Long reviewId) {
		Review review=reviewRepository.findById(reviewId)
				.orElseThrow(()->new IllegalArgumentException("Invalid review ID"));
		
		User user=authRepository.findById(review.getUser().getId())
				.orElseThrow(()->new IllegalArgumentException("Invalid user ID"));
		
		return ConsultantDetailReviewResponse.toDto(review);
		
	}
}
