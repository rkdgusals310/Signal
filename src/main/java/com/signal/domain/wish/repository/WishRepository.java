package com.signal.domain.wish.repository;

import com.signal.domain.wish.model.Wish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface WishRepository extends JpaRepository<Wish, Long> {

    @Query("SELECT w FROM Wish w WHERE w.consultant.id = :consultantId AND w.user.id = :userId")
    Wish findWishByConsultantIdAndUserId(@Param("consultantId") Long consultantId, @Param("userId") Long userId);

    default boolean existsWishById(Long consultantId, Long userId) {
        return findWishByConsultantIdAndUserId(consultantId, userId) != null;
    }
}
