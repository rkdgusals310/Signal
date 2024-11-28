package com.signal.domain.auth.service;

import com.signal.domain.article.model.Article;
import com.signal.domain.article.repository.ArticleRepository;
import com.signal.domain.auth.dto.response.ConsultantDetailArticleResponse;
import com.signal.domain.auth.dto.response.ConsultantDetailResponse;
import com.signal.domain.auth.dto.response.ConsultantDetailReviewResponse;
import com.signal.domain.auth.dto.response.ConsultantListResponse;
import com.signal.domain.auth.dto.response.ConsultantPreviewResponse;
import com.signal.domain.auth.dto.response.ConsultantResponse;
import com.signal.domain.auth.model.User;
import com.signal.domain.auth.model.enums.AvailableDays;
import com.signal.domain.auth.model.enums.Gender;
import com.signal.domain.auth.repository.AuthRepository;
import com.signal.domain.chatting.repository.ChattingRepository;
import com.signal.domain.review.model.Review;
import com.signal.domain.review.repository.ReviewRepository;
import com.signal.global.dto.PagedDto;
import com.signal.global.exception.errorCode.ErrorCode;
import com.signal.global.exception.handler.InvalidValueException;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConsultantService {

    private final AuthRepository authRepository;
    private final ChattingRepository chattingRepository;
    private final ReviewRepository reviewRepository;
    private final ArticleRepository articleRepository;
    

    public PagedDto<ConsultantListResponse> getConsultants(
        int size, int page
    ) {
        Pageable pageable = PageRequest.of(0, 20);
        Page<User> topConsultants = authRepository.findTopConsultants(pageable);

        List<ConsultantPreviewResponse> consultantPreviewResponses = topConsultants.stream()
            .map(
                ConsultantPreviewResponse::toDto
            ).collect(Collectors.toList());

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Direction.DESC, "nickname"));

        Page<User> consultants = authRepository.findConsultants(pageRequest);

        List<ConsultantResponse> consultantResponses = consultants.stream()
            .map( consultant -> {
                int chattingCount = chattingRepository.countByConsultant(consultant.getId());
                return ConsultantResponse.toDto(consultant, chattingCount);
            }).collect(Collectors.toList());

        int totalCount = (int) consultants.getTotalElements();
        int totalPages = (totalCount + size - 1) / size;

        ConsultantListResponse consultantListResponse = ConsultantListResponse.toDto(totalCount, consultantPreviewResponses, consultantResponses);

        return PagedDto.toDTO(page, size, totalPages, List.of(consultantListResponse));
    }

    public PagedDto<ConsultantResponse> getSearchConsultants(
        String search, Gender gender, AvailableDays availableDays, int size, int page
    ) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Direction.DESC, "createdAt"));

        Page<User> consultants = authRepository.findConsultantsBySearch(search, gender, availableDays, pageRequest);

        List<ConsultantResponse> consultantResponses = consultants.stream()
            .map( consultant -> {
                int chattingCount = chattingRepository.countByConsultant(consultant.getId());
                return ConsultantResponse.toDto(consultant, chattingCount);
            }).collect(Collectors.toList());

        int totalCount = (int) consultants.getTotalElements();
        int totalPages = (totalCount + size - 1) / size;

        return PagedDto.toDTO(page, size, totalPages, consultantResponses);
    }

    public ConsultantDetailResponse getConsultantById(Long consultantId) {
        User user = authRepository.findConsultantById(consultantId);
        int reviewsCount = reviewRepository.countReviewsByConsultantId(consultantId);
        List<ConsultantDetailReviewResponse> review=reviewRepository.findConsultantById(consultantId);
        List<ConsultantDetailArticleResponse> article=articleRepository.findConsultantById(consultantId);
        
        return ConsultantDetailResponse.toDto(user, reviewsCount,review,article);
    }
}
