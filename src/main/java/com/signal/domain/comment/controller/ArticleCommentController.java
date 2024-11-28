package com.signal.domain.comment.controller;

import java.util.Optional;


import com.signal.domain.comment.dto.response.MyCommentResponse;
import com.signal.global.dto.PagedDto;
import com.signal.global.sercurity.CustomUserDetails;
import org.springframework.data.domain.Page;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.signal.domain.article.dto.response.SearchResponse;
import com.signal.domain.comment.dto.response.ArticleCommentPagedResponse;
import com.signal.domain.comment.dto.response.ArticleCommentResponse;
import com.signal.domain.comment.dto.response.CommentPagedResponse;
import com.signal.domain.comment.dto.response.CommentResponse;
import com.signal.domain.comment.dto.response.CursorPagedDto;
import com.signal.domain.comment.dto.resquest.ArticleCommentCreateRequest;
import com.signal.domain.comment.dto.resquest.CommentCreateRequest;
import com.signal.domain.comment.dto.resquest.CommentUpdateRequest;
import com.signal.domain.comment.model.Comment;
import com.signal.domain.comment.service.ArticleCommentService;
import com.signal.global.sercurity.CustomUserDetails;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ArticleCommentController {

	private final ArticleCommentService commentService;

	@Operation(summary = "댓글 생성")
	@PostMapping("/common/article/{article}/comment")
	public ResponseEntity<Void> createComment(
			@PathVariable Long article,
			@AuthenticationPrincipal CustomUserDetails userDetails, 
			@RequestBody ArticleCommentCreateRequest request) {
		Long userId = userDetails.getUserId();
		commentService.createComment(request, userId);
		return ResponseEntity.ok().build();
	}

	@Operation(summary = "댓글 수정")
	@PutMapping("/common/article/{article}/comment/{commentId}")
	public ResponseEntity<Void> updateComment(
			@AuthenticationPrincipal CustomUserDetails userDetails,
			@PathVariable Long article, @PathVariable Long commentId, 
			@RequestBody CommentUpdateRequest request) {
		Long userId = userDetails.getUserId();
		commentService.updateComment(commentId, request, userId);
		return ResponseEntity.ok().build();

	}

	@Operation(summary="댓글 삭제")
	@DeleteMapping("/common/article/{article}/comment/{commentId}")
	public ResponseEntity<Void> deleteComment(
			@AuthenticationPrincipal CustomUserDetails userDetails,
			@PathVariable Long article,
			@PathVariable Long commentId
			){
			Long userId = userDetails.getUserId();
			commentService.deleteComment(commentId,userId,article);
			return ResponseEntity.ok().build();
		
	}

	@Operation(summary="댓글 조회")
	@GetMapping("/common/article/{article}/comment")
	public ResponseEntity<CursorPagedDto<ArticleCommentResponse>> getCommentByPostId(
	        @PathVariable Long article,
	        @RequestParam(required = false) Long cursorId,
	        @RequestParam(defaultValue = "10") int size,
	        @AuthenticationPrincipal CustomUserDetails customUserDetails
	        
	) {
		ArticleCommentPagedResponse response = commentService.getCommentsByPostIdWithCursor(article, cursorId, size);
	    Long userId = customUserDetails.getUserId();
	    
	    CursorPagedDto<ArticleCommentResponse> cursorPagedResponse = new CursorPagedDto<>(
	        response.getComments(),
	        response.getRepliesCount(),
	        response.getNextCursorId(),
	        response.isHasNext(),
	        size,
	        userId
	    );

	    return ResponseEntity.ok(cursorPagedResponse);
	}

    
}
