package com.signal.domain.article.dto.response;

import java.time.LocalDateTime;

import com.signal.domain.article.model.Article;
import com.signal.domain.auth.model.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArticleDetailResponse {
	private String thumbnail;
	private Long id;
	private String title;
	private String consultantName;
	private LocalDateTime createAt;
	private LocalDateTime modifiedAt;
	private Long commentsCount;
	private String contents;

	public static ArticleDetailResponse toDto(Article article) {
		return ArticleDetailResponse.builder()
				.thumbnail(article.getThumbnail())
				.id(article.getId())
				.title(article.getTitle())
				.commentsCount(article.getCommentCount())
				.contents(article.getContents())
				.build();
	}
}
