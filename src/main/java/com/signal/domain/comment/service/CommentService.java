package com.signal.domain.comment.service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.signal.domain.auth.model.User;
import com.signal.domain.auth.repository.AuthRepository;
import com.signal.domain.comment.dto.resquest.CommentCreateRequest;
import com.signal.domain.comment.dto.resquest.CommentUpdateRequest;
import com.signal.domain.comment.model.Comment;
import com.signal.domain.comment.repository.CommentRepository;
import com.signal.domain.post.model.Post;
import com.signal.domain.post.repository.PostRepository;
import com.signal.global.exception.errorCode.ErrorCode;
import com.signal.global.exception.handler.CustomIllegalArgumentException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Service
@Slf4j
public class CommentService {
	private final PostRepository postRepository;
	private final CommentRepository commentRepository;
	private final AuthRepository authRepository;

	@Transactional
	public void createComment(CommentCreateRequest request, Long userId) {
	    Post post = postRepository.findById(request.getPostId())
	            .orElseThrow(() -> new CustomIllegalArgumentException(ErrorCode.POST_NOT_FOUND));
	    
	    User user = authRepository.findById(userId)
	            .orElseThrow(() -> new CustomIllegalArgumentException(ErrorCode.USER_NOT_FOUND));

	    Comment comment = new Comment(post, user, request.getContents());
	    commentRepository.save(comment);
	    log.info("댓글 작성 완료: {}", comment);
	}

	@Transactional
	public void updateComment(Long commentId,CommentUpdateRequest request) {
		Comment comment=commentRepository.findById(commentId)
				.orElseThrow(()->new CustomIllegalArgumentException(ErrorCode.COMMENT_NOT_FOUND));
		
		
		/*
		  comment.setContents(request.getContents());
		  // or
		  comment.setContents(newContents) // 위에 CommentUpdateRequest request를 String 로 받아오는 경우도 가능
		*/
		comment.updateCotents(request.getContents()); //위의 방식들도 가능하나 이 방식이 더 효율적
		log.info("댓글 수정 완료: {}",comment);
	}
	
	@Transactional
	public void deleteComment(Long commentId) {
		if(!commentRepository.existsById(commentId)) {
			throw new CustomIllegalArgumentException(ErrorCode.COMMENT_NOT_FOUND);
		}
		commentRepository.deleteById(commentId);
		log.info("댓글 삭제 완료: 댓글 ID{}",commentId);
	}
	
	   public int getTotalCommentsCountForPost(Long postId) {
	        return commentRepository.countByPostId(postId);
	    }
	
	
	public Page<Comment> getCommentByPostID(Long postId,Pageable pageable){
		postRepository.findById(postId)
			.orElseThrow(()-> new CustomIllegalArgumentException(ErrorCode.POST_NOT_FOUND));
		 Page<Comment> comments=commentRepository.findByPost_Id(postId,pageable);
		 log.info("게시물 ID{}에 대한 댓글 조회 완료{}개 ",postId, comments.getTotalElements());
		 
		return comments;
		
	}
	
}
