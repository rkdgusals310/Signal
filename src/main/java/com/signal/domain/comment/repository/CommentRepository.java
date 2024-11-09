package com.signal.domain.comment.repository;

import java.util.List;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.signal.domain.comment.model.Comment;
import com.signal.domain.post.model.Post;

public interface CommentRepository extends JpaRepository<Comment,Long> {
	
	//특정 게시물 댓글 조회
	List<Comment> findByPost_Id(Long postId);
	Page<Comment> findByPost_Id(Long postId, Pageable pageable);
	//특정 게시물에 댓글 작성
	//특정 게시물 댓글 수정
	//특정 게시물 댓글 삭제
	
	 int countByPostId(Long postId);
}


