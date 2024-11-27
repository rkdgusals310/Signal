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
public class ConsultantDetailReviewResponse {

    private String userName;
    private Double rating;
    private String content;
    
    public ConsultantDetailReviewResponse(String nickname, String content, Double rating) {
        this.userName = nickname;
        this.content = content;
        this.rating = rating;
    }

}
