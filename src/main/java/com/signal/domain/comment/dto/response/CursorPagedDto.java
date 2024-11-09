package com.signal.domain.comment.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CursorPagedDto<T> {
    private List<T> comments;
    private int repliesCount;
    private Long nextCursorId;
    private boolean hasNext;

}
