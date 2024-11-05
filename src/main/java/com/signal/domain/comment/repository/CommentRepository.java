package com.signal.domain.comment.repository;

import com.signal.domain.likes.model.Likes;
import java.util.List;


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

	@Query("SELECT c FROM Comment c WHERE c.user.id = :userId")
	Page<Comment> findCommentsByUserId(
		@Param("userId")Long userId, Pageable pageable
	);
}


