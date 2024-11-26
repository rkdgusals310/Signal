package com.signal.domain.post.service;

import com.fasterxml.jackson.core.JsonProcessingException;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.signal.domain.auth.model.User;
import com.signal.domain.auth.model.enums.Role;
import com.signal.domain.auth.repository.AuthRepository;
import com.signal.domain.post.dto.request.CompletionRequestDto;
import com.signal.domain.post.dto.request.PostRequest;
import com.signal.domain.post.dto.response.CategoryResponse;
import com.signal.domain.post.dto.response.FilterResponse;
import com.signal.domain.post.dto.response.MyPostResponse;
import com.signal.domain.post.dto.response.PostDetailResponse;
import com.signal.domain.post.dto.response.PostResponse;
import com.signal.domain.post.dto.response.SearchResponse;
import com.signal.domain.post.model.Post;
import com.signal.domain.post.model.enums.Category;
import com.signal.domain.post.repository.PostRepository;
import com.signal.global.dto.PagedDto;
import com.signal.global.exception.errorCode.ErrorCode;
import com.signal.global.exception.handler.InvalidValueException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
@Slf4j
public class PostService {

    private final PostRepository postRepository;
    private final AuthRepository authRepository;
    private final ChatGPTServiceImpl chatGPTService;

    @Transactional
    public PagedDto<CategoryResponse> getPosts(
        Category category, int size, int page
    ) {
        Post hotpost = postRepository.findTopByCategoryOrderByViewCountDesc(category);
        PostResponse hotpostResponse = PostResponse.toDto(hotpost);

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Direction.DESC, "createdAt"));

        Page<Post> posts = postRepository.findByCategory(category, pageRequest);

        List<PostResponse> postsResponse = posts.stream()
            .map(
                PostResponse::toDto
            ).collect(Collectors.toList());

        int totalCount = (int) posts.getTotalElements();
        int totalPages = (totalCount + size - 1) / size;

        CategoryResponse searchResponse = CategoryResponse.toDto(totalCount, hotpostResponse, postsResponse);

        return PagedDto.toDTO(page, size, totalPages, List.of(searchResponse));
    }

    @Transactional
    public PostDetailResponse getPostById(Long id) {
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new InvalidValueException(ErrorCode.POST_NOT_FOUND));

        postRepository.incrementViewCountById(id);

        return PostDetailResponse.toDto(post);
    }

    @Transactional
    public FilterResponse createPost(PostRequest postRequest, Long userId){

        // consultant가 아닌지도 확인 필요 추후 수정해야 함.
        User user = authRepository.findUserById(userId);
        if (user.getRole().equals(Role.CONSULTANT)) {
            throw new InvalidValueException(ErrorCode.WRONG_ROLE_POST);
        }

        FilterResponse filterResponse = filterChatGPT(postRequest.getTitle() + " " + postRequest.getContents());

        if(!filterResponse.isFiltered()) {
            Post newPost = Post.toEntity(postRequest, user);
            postRepository.save(newPost);
        }

        return filterResponse;
    }

    @Transactional
    public FilterResponse updatePost(
        PostRequest postRequest,
        Long postId,
        Long userId
    ) {
        postRepository.existsByIdAndUserId(postId, userId);
        Post post = postRepository.findPostById(postId);

        FilterResponse filterResponse = filterChatGPT(postRequest.getTitle() + " " + postRequest.getContents());

        if(!filterResponse.isFiltered()) {
            post.update(postRequest);
        }

        return filterResponse;
    }

    public void deletePost(Long postId, Long userId) {
        postRepository.existsByIdAndUserId(postId, userId);

        postRepository.deleteById(postId);
    }

    public FilterResponse filterChatGPT(String prompt) {

        CompletionRequestDto completionRequestDto = CompletionRequestDto.toDto(prompt);
        Map<String, Object> result = chatGPTService.prompt(completionRequestDto);

        List<String> invalidSentences = new ArrayList<>();
        ObjectMapper objectMapper = new ObjectMapper();

        log.info("ChatGPT Result: {}", result);

        // 답변에 무조건 choices가 포함됨
        if (result.containsKey("choices")) {
            List<Map<String, Object>> choices = (List<Map<String, Object>>) result.get("choices");
            Map<String, Object> firstChoice = (Map<String, Object>) choices.get(0);

            Map<String, String> message = (Map<String, String>) firstChoice.get("message");

            log.info("message: {}", message);

            try {

            	String content = message.get("content");
            	int beginIndex = content.indexOf("{");

            	// 인덱스 유효성 검사 추가
            	if (beginIndex == -1) {
            	    log.warn("ChatGPT 응답에 JSON 형식이 포함되지 않았습니다: {}", content);
            	    return FilterResponse.toDto(false, invalidSentences);
            	}

            	content = content.substring(beginIndex).trim();


                Map<String, Object> responseText = objectMapper.readValue(content, Map.class);

                boolean isFiltered = (boolean) responseText.get("isFiltered");

                if (isFiltered) {
                    invalidSentences = (List<String>) responseText.get("InvalidSentences");
                }

                return FilterResponse.toDto(isFiltered, invalidSentences);
            } catch (JsonMappingException e) {
                log.info(e.getMessage());
            } catch (JsonProcessingException e) {
                log.info(e.getMessage());
            }

        }

        return FilterResponse.toDto(false, invalidSentences);
    }

    @Transactional
    public PagedDto<MyPostResponse> getMyPosts(
        Long userId, int size, int page
    ) {
        authRepository.existsById(userId);

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Direction.DESC, "createdAt"));

        Page<Post> posts = postRepository.findByUserId(userId, pageRequest);

        List<PostResponse> postsResponse = posts.stream()
            .map(
                PostResponse::toDto
            ).collect(Collectors.toList());

        int totalCount = (int) posts.getTotalElements();
        int totalPages = (totalCount + size - 1) / size;

        MyPostResponse myPostResponse = MyPostResponse.toDto(totalCount, postsResponse);

        return PagedDto.toDTO(page, size, totalPages, List.of(myPostResponse));
    }

    public PagedDto<SearchResponse> getSearchPosts(String search, int size, int page) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Direction.DESC, "createdAt"));

        Page<Post> posts = postRepository.findBySearch(search, pageRequest);

        List<PostResponse> postsResponse = posts.stream()
            .map(
                PostResponse::toDto
            ).collect(Collectors.toList());

        int totalCount = (int) posts.getTotalElements();
        int totalPages = (totalCount + size - 1) / size;

        SearchResponse searchResponse = SearchResponse.toDto(totalCount, postsResponse);

        return PagedDto.toDTO(page, size, totalPages, List.of(searchResponse));
    }
}
