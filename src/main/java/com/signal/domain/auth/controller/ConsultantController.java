package com.signal.domain.auth.controller;

import com.signal.domain.auth.dto.response.ConsultantDetailResponse;
import com.signal.domain.auth.dto.response.ConsultantListResponse;
import com.signal.domain.auth.dto.response.ConsultantResponse;
import com.signal.domain.auth.model.enums.AvailableDays;
import com.signal.domain.auth.model.enums.Gender;
import com.signal.domain.auth.service.ConsultantService;
import com.signal.global.dto.PagedDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@Tag(name = "Consultant", description = "상담사 페이지")
public class ConsultantController {

    private final ConsultantService consultantService;

    @GetMapping("/common/consultant")
    @Operation(summary = "상담사 리스트 확인")
    public ResponseEntity<PagedDto<ConsultantListResponse>> getConsultants (
        @RequestParam(required = false, value = "size", defaultValue = "10") int size,
        @RequestParam(required = false, value = "page", defaultValue = "0") int page
    ) {
        PagedDto<ConsultantListResponse> consultantsResponse = consultantService.getConsultants(size, page);

        return ResponseEntity.ok(consultantsResponse);
    }

    @GetMapping("/common/consultant/search")
    @Operation(summary = "상담사 검색")
    public ResponseEntity<PagedDto<ConsultantResponse>> getSearchConsultants (
        @RequestParam(required = false, value = "search") String search,
        @RequestParam(required = false, value = "gender") Gender gender,
        @RequestParam(required = false, value = "days") AvailableDays availableDays,
        @RequestParam(required = false, value = "size", defaultValue = "10") int size,
        @RequestParam(required = false, value = "page", defaultValue = "0") int page
    ) {
        PagedDto<ConsultantResponse> consultantResponse = consultantService.getSearchConsultants(search, gender, availableDays, size, page);

        return ResponseEntity.ok(consultantResponse);
    }

    @GetMapping("/common/consultant/{consultantId}")
    @Operation(summary = "상담사 프로필 조회")
    public ResponseEntity<ConsultantDetailResponse> getConsultantById(
        @PathVariable Long consultantId
    ) {
        return ResponseEntity.ok(consultantService.getConsultantById(consultantId));
    }
}
