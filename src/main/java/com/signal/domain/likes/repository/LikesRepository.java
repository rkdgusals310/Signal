package com.signal.domain.likes.repository;

import com.signal.domain.likes.model.Likes;
import com.signal.global.exception.errorCode.ErrorCode;
import com.signal.global.exception.handler.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LikesRepository extends JpaRepository<Likes, Long> {

    @Query("SELECT l FROM Likes l WHERE l.post.id = :postId AND l.user.id = :userId")
    Likes findLikesByPostIdAndUserId(@Param("postId")Long postId, @Param("userId")Long userId);

    default boolean existsLikesById(Long postId, Long userId) {
        return findLikesByPostIdAndUserId(postId, userId) != null;
    }

    default Likes findLikesById(Long likesId) {
        return findById(likesId).orElseThrow(() -> new EntityNotFoundException(ErrorCode.NOT_FOUND));
    }

    @Query("SELECT l FROM Likes l WHERE l.user.id = :userId")
    Page<Likes> findLikesByUserId(
        @Param("userId")Long userId, Pageable pageable
    );
}
