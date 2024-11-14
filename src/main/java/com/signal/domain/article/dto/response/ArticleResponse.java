package com.signal.domain.article.dto.response;

import java.time.LocalDateTime;
import com.signal.domain.article.model.Article;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArticleResponse {
	private Long id;
	private String title;
	private String consultantName;
	private LocalDateTime createAt;
	private Long commentCount;
	private Long likesCount;

	public static ArticleResponse toDto(Article article) {
	    if (article == null || article.getUser() == null) {
	        throw new IllegalArgumentException("Article or User cannot be null");
	    }
		return ArticleResponse.builder()
				.id(article.getId())
				.title(article.getTitle())
				.consultantName(article.getUser().getNickname())
				.createAt(article.getCreatedAt())
				.commentCount(article.getCommentCount())
				.likesCount(article.getLikesCount())
				.build()
				;

	}
}
