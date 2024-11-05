package com.signal.domain.post.repository;

import com.signal.domain.post.model.Post;
import com.signal.domain.post.model.enums.Category;
import com.signal.global.exception.errorCode.ErrorCode;
import com.signal.global.exception.handler.EntityNotFoundException;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface PostRepository extends JpaRepository<Post, Long> {


   @Query("SELECT p FROM Post p WHERE p.deletedAt IS NULL AND p.category = :category ORDER BY p.viewCount DESC, p.createdAt DESC LIMIT 1")
   Post findTopByCategoryOrderByViewCountDesc(
       @Param("category") Category category
   );

   @Query("SELECT p FROM Post p WHERE p.deletedAt IS NULL AND p.category = :category")
   Page<Post> findByCategory(
       @Param("category")Category category,
       Pageable pageable
   );

   @Query("SELECT p.id FROM Post p WHERE p.id = :postId AND p.user.id = :userId")
   Long findByPostIdAndUserId(Long postId, Long userId);

   default boolean existsByIdAndUserId(Long postId, Long userId) {
      if (findByPostIdAndUserId(postId, userId) == null) throw new EntityNotFoundException(
          ErrorCode.NOT_FOUND);
      return true;
   }

   default Post findPostById(Long postId) {
      return findById(postId).orElseThrow(() -> new EntityNotFoundException(ErrorCode.NOT_FOUND));
   }

   @Transactional
   @Modifying
   @Query("UPDATE Post p SET p.likesCount = p.likesCount + 1 WHERE p.id = :postId")
   void incrementLikesCountById(Long postId);

   @Transactional
   @Modifying
   @Query("UPDATE Post p SET p.likesCount = p.likesCount - 1 WHERE p.id = :postId")
   void decrementLikesCountById(Long postId);

   @Transactional
   @Modifying
   @Query("UPDATE Post p SET p.viewCount = p.viewCount + 1 WHERE p.id = :postId")
   void incrementViewCountById(Long postId);

   @Query("SELECT p FROM Post p WHERE p.deletedAt IS NULL AND p.user.id = :userId")
   Page<Post> findByUserId(
       @Param("userId") Long userId,
       Pageable pageable
   );

}
