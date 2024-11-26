package com.signal.domain.comment.repository;

import com.signal.domain.likes.model.Likes;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.signal.domain.comment.model.Comment;
import com.signal.domain.post.model.Post;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CommentRepository extends JpaRepository<Comment,Long> {
	
	//특정 게시물 댓글 조회
	List<Comment> findByPost_Id(Long postId);
	Page<Comment> findByPost_Id(Long postId, Pageable pageable);
	//특정 게시물에 댓글 작성
	//특정 게시물 댓글 수정
	//특정 게시물 댓글 삭제
	
	
	 // 커서와 제한된 수의 댓글을 조회하도록 메서드 수정
    List<Comment> findByPostIdAndIdLessThanOrderByIdDesc(Long postId, Long cursorId, Pageable pageable);
    
    // 첫 번째 페이지를 가져오는 메서드도 필요할 경우 추가
    List<Comment> findTopByPostIdOrderByIdDesc(Long postId, Pageable pageable);
	
	 int countByPostId(Long postId);

	@Query("SELECT c FROM Comment c WHERE c.user.id = :userId")
	Page<Comment> findCommentsByUserId(
		@Param("userId")Long userId, Pageable pageable
	);
}


