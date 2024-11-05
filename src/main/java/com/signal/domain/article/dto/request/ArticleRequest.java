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
    @Size(min = 10, max = 255)
    private String title;

    @NotBlank
    @Size(min = 100)
    private String content;

    @NotBlank
    private String thumbnail;;

}
