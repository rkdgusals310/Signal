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
@Builder
public class ConsultantDetailArticleResponse {
    
    private String thumbnail;
    private String title;
	public ConsultantDetailArticleResponse(String thumbnail, String title) {
		super();
		this.thumbnail = thumbnail;
		this.title = title;
	}
    
  
}
