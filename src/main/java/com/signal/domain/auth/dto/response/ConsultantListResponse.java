package com.signal.domain.auth.dto.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultantListResponse {

    private int totalElements;
    private List<ConsultantPreviewResponse> topConsultants;
    private List<ConsultantResponse> consultants;

    public static ConsultantListResponse toDto(int totalElements, List<ConsultantPreviewResponse> topConsultants, List<ConsultantResponse> consultants) {
        return ConsultantListResponse.builder()
            .totalElements(totalElements)
            .topConsultants(topConsultants)
            .consultants(consultants)
            .build()
            ;
    }
}
