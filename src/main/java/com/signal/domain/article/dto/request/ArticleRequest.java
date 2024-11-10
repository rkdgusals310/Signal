package com.signal.domain.article.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleRequest {
	@NotBlank
	@Size(min = 5, max = 20)
	private String title;

	@NotBlank
	@Size(min = 10)
	private String contents;
	
	private String thumbnail;

}
