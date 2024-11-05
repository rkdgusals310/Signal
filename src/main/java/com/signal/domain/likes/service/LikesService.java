package com.signal.domain.likes.service;

import com.signal.domain.article.model.Article;
import com.signal.domain.article.repository.ArticleRepository;
import com.signal.domain.auth.model.User;
import com.signal.domain.auth.repository.AuthRepository;
import com.signal.domain.likes.dto.LikeResponse;
import com.signal.domain.likes.dto.MyLikesResponse;
import com.signal.domain.likes.model.Likes;
import com.signal.domain.likes.repository.LikesRepository;
import com.signal.domain.post.model.Post;
import com.signal.domain.post.repository.PostRepository;
import com.signal.global.dto.PagedDto;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class LikesService {

    private final LikesRepository likesRepository;
    private final AuthRepository authRepository;
    private final PostRepository postRepository;
    private final ArticleRepository articleRepository;

    public String likesPost(Long postId, Long userId) {
        User user = authRepository.findUserById(userId);
        Post post = postRepository.findPostById(postId);

        if (likesRepository.existsLikesById(postId, userId)) {
            Likes likes = likesRepository.findLikesByPostIdAndUserId(postId, userId);
            likesRepository.delete(likes);
            postRepository.decrementLikesCountById(postId);
            return "Unlike Success";
        } else {
            Likes likes = Likes.createPostLike(post, user);
            likesRepository.save(likes);
            postRepository.incrementLikesCountById(postId);
            return "Like Success";
        }
    }

    public PagedDto<MyLikesResponse> getMyLikes (
        Long userId, int size, int page
    ) {
        authRepository.existsById(userId);

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Direction.DESC, "createdAt"));

        Page<Likes> likes = likesRepository.findLikesByUserId(userId, pageRequest);

        List<LikeResponse> likeResponses = likes.stream()
            .map(
                like -> {
                    if (like.getArticle() != null) {
                        Long articleId = like.getArticle().getId();
                        Article article = articleRepository.findArticleById(articleId);
                        return LikeResponse.toDto(article);
                    } else {
                        Long postId = like.getPost().getId();
                        Post post = postRepository.findPostById(postId);
                        return LikeResponse.toDto(post);
                    }
                }
            ).collect(Collectors.toList());

        int totalCount = (int) likes.getTotalElements();
        int totalPages = (totalCount + size - 1) / size;

        MyLikesResponse myLikesResponse = MyLikesResponse.toDto(totalCount, likeResponses);

        return PagedDto.toDTO(page, size, totalPages, List.of(myLikesResponse));
    }
}
