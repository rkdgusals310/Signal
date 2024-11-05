package com.signal.domain.comment.service;


import com.signal.domain.article.model.Article;
import com.signal.domain.article.repository.ArticleRepository;
import com.signal.domain.comment.dto.response.CommentSumResponse;
import com.signal.domain.comment.dto.response.MyCommentResponse;
import com.signal.domain.post.model.Post;
import com.signal.global.dto.PagedDto;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.signal.domain.auth.repository.AuthRepository;
import com.signal.domain.comment.dto.resquest.CommentCreateRequest;
import com.signal.domain.comment.dto.resquest.CommentUpdateRequest;
import com.signal.domain.comment.model.Comment;
import com.signal.domain.comment.repository.CommentRepository;
import com.signal.domain.post.repository.PostRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Service
@Slf4j
public class CommentService {
	private final PostRepository postRepository;
	private final CommentRepository commentRepository;
	private final AuthRepository authRepository;
	private final ArticleRepository articleRepository;

	@Transactional
	public void createComment(CommentCreateRequest request) {
	    var post = postRepository.findById(request.getPostId())
	            .orElseThrow(() -> new IllegalArgumentException("해당 게시물이 존재하지 않습니다."));
	    
	    var user = authRepository.findById(request.getUserId())
	            .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 존재하지 않습니다."));

	    Comment comment = new Comment(post, user, request.getContents());
	    commentRepository.save(comment);
	    log.info("댓글 작성 완료: {}", comment);
	}

	@Transactional
	public void updateComment(Long commentId,CommentUpdateRequest request) {
		Comment comment=commentRepository.findById(commentId)
				.orElseThrow(()->new IllegalArgumentException("해당 댓글이 존재하지 않습니다"));
		
		
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
			throw new IllegalArgumentException("해당 댓글을 찾을 수 없습니다.");
		}
		commentRepository.deleteById(commentId);
		log.info("댓글 삭제 완료: 댓글 ID{}",commentId);
	}
	
	public Page<Comment> getCommentByPostID(Long postId,Pageable pageable){
		postRepository.findById(postId)
			.orElseThrow(()-> new IllegalArgumentException("해당 게시물은 존재하지 않습니다"));
		 Page<Comment> comments=commentRepository.findByPost_Id(postId,pageable);
		 log.info("게시물 ID{}에 대한 댓글 조회 완료{}개 ",postId, comments.getTotalElements());
		 
		return comments;
		
	}

	@Transactional
	public PagedDto<MyCommentResponse> getMyComments(Long userId, int size, int page) {
		authRepository.findById(userId);

		PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Direction.DESC, "createdAt"));

		Page<Comment> comments = commentRepository.findCommentsByUserId(userId, pageRequest);

		List<CommentSumResponse> commentResponses = comments.stream()
			.map(
				comment -> {
					if (comment.getArticle() != null) {
						Long articleId = comment.getArticle().getId();
						Article article = articleRepository.findArticleById(articleId);
						return CommentSumResponse.toDto(article, comment);
					} else {
						Long postId = comment.getPost().getId();
						Post post = postRepository.findPostById(postId);
						return CommentSumResponse.toDto(post, comment);
					}
				}
			).collect(Collectors.toList());

		int totalCount = (int) comments.getTotalElements();
		int totalPages = (totalCount + size - 1) / size;

		MyCommentResponse myCommentResponse = MyCommentResponse.toDto(totalCount, commentResponses);

		return PagedDto.toDTO(page, size, totalPages, List.of(myCommentResponse));
	}
}
