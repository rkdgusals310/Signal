package com.signal.domain.comment.service;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.signal.domain.auth.model.User;
import com.signal.domain.auth.repository.AuthRepository;
import com.signal.domain.comment.dto.response.CommentPagedResponse;
import com.signal.domain.comment.dto.response.CommentResponse;
import com.signal.domain.comment.dto.resquest.CommentCreateRequest;
import com.signal.domain.comment.dto.resquest.CommentUpdateRequest;
import com.signal.domain.comment.model.Comment;
import com.signal.domain.comment.repository.CommentRepository;
import com.signal.domain.post.model.Post;
import com.signal.domain.post.repository.PostRepository;
import com.signal.global.exception.errorCode.ErrorCode;
import com.signal.global.exception.handler.AccessDeniedException;
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
	public void updateComment(Long commentId,CommentUpdateRequest request, Long userId) {
		Comment comment=commentRepository.findById(commentId)
				.orElseThrow(()->new CustomIllegalArgumentException(ErrorCode.COMMENT_NOT_FOUND));
		if(!comment.getUser().getId().equals(userId)) {
			throw new AccessDeniedException(ErrorCode.USER_NOT_FOUND);
		}
		
		/*
		  comment.setContents(request.getContents());
		  // or
		  comment.setContents(newContents) // 위에 CommentUpdateRequest request를 String 로 받아오는 경우도 가능
		*/
		comment.updateCotents(request.getContents()); //위의 방식들도 가능하나 이 방식이 더 효율적
		log.info("댓글 수정 완료: {}",comment);
	}
		
	
	@Transactional
	public void deleteComment(Long commentId, Long userId) {
	    // 댓글이 존재하는지 확인하고 댓글 객체를 가져옵니다.
	    Comment comment = commentRepository.findById(commentId)
	        .orElseThrow(() -> new CustomIllegalArgumentException(ErrorCode.COMMENT_NOT_FOUND));

	    // 댓글 작성자와 현재 요청한 사용자의 ID가 일치하는지 확인합니다.
	    if (!comment.getUser().getId().equals(userId)) {
	        throw new AccessDeniedException(ErrorCode.USER_NOT_FOUND); 
	    }

	    // 댓글 삭제
	    commentRepository.deleteById(commentId);
	    log.info("댓글 삭제 완료: 댓글 ID {}", commentId);
	}

	
//	public int getTotalCommentsCountForPost(Long postId) {
//	        return commentRepository.countByPostId(postId);
//	  }
//	
//	
//	public Page<Comment> getCommentByPostID(Long postId,Pageable pageable){
//		postRepository.findById(postId)
//			.orElseThrow(()-> new CustomIllegalArgumentException(ErrorCode.POST_NOT_FOUND));
//		 Page<Comment> comments=commentRepository.findByPost_Id(postId,pageable);
//		 log.info("게시물 ID{}에 대한 댓글 조회 완료{}개 ",postId, comments.getTotalElements());
//		 
//		return comments;
//		
//	}
	
	@Transactional(readOnly = true)
	public CommentPagedResponse getCommentsByPostIdWithCursor(Long postId, Long cursorId, int size) {
	    Pageable pageable = PageRequest.of(0, size);

	    List<Comment> comments = (cursorId == null)
	        ? commentRepository.findTopByPostIdOrderByIdDesc(postId, pageable)
	        : commentRepository.findByPostIdAndIdLessThanOrderByIdDesc(postId, cursorId, pageable);

	    List<CommentResponse> commentResponses = comments.stream()
	        .map(CommentResponse::toDto)
	        .collect(Collectors.toList());

	    Long nextCursorId = !comments.isEmpty() ? comments.get(comments.size() - 1).getId() : null;
	    boolean hasNext = comments.size() == size;

	    int repliesCount = commentRepository.countByPostId(postId);

	    return CommentPagedResponse.toDto(commentResponses, repliesCount, nextCursorId, hasNext);
	}


	
	
}
