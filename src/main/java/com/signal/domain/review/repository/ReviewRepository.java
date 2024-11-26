package com.signal.domain.review.repository;

import com.signal.domain.review.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("SELECT COUNT(r) FROM Review r WHERE r.consultant.id = :consultantId")
    int countReviewsByConsultantId(@Param("consultantId") Long consultantId);
    
 
    
    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM Review r WHERE r.consultant.id = :consultantId")
    Double calculateAverageRatingByConsultantId(@Param("consultantId") Long consultantId);

}
