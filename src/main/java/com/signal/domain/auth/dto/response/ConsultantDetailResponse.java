package com.signal.domain.auth.dto.response;

import java.util.List;

import com.signal.domain.article.model.Article;
import com.signal.domain.auth.model.User;
import com.signal.domain.auth.model.enums.AvailableDays;
import com.signal.domain.auth.model.enums.Gender;
import com.signal.domain.review.model.Review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultantDetailResponse {

    private String name;
    private Gender gender;
    private String keyword;
    private Double totalRating;
    private int reviewsCount;
    private String profileImage;
    private String profile;
    private AvailableDays availableDays;
    private String certifiedQualification;
    private String experience;
    
    private List<ConsultantDetailReviewResponse> reviewList;
    private List<ConsultantDetailArticleResponse> articleList;
    
  
    
    

    public static ConsultantDetailResponse toDto(User user, int reviewsCount,List<ConsultantDetailReviewResponse> review,List<ConsultantDetailArticleResponse> article) {
        return ConsultantDetailResponse.builder()
            .name(user.getNickname())
            .gender(user.getGender())
            .keyword(user.getKeyword())
            .totalRating(user.getTotalRating())
            .reviewsCount(reviewsCount)
            .profileImage(user.getImage())
            .profile(user.getProfile())
            .availableDays(user.getAvailableDays())
            .certifiedQualification(user.getCertifiedQualification())
            .experience(user.getExperience())
            .reviewList(review)
            .articleList(article)
            .build()
            ;
    }
}
