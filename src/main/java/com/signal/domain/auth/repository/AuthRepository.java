package com.signal.domain.auth.repository;

import com.signal.domain.auth.model.User;
import com.signal.domain.auth.model.enums.AvailableDays;
import com.signal.domain.auth.model.enums.Gender;
import com.signal.global.exception.errorCode.ErrorCode;
import com.signal.global.exception.handler.EntityNotFoundException;
import com.signal.global.exception.handler.InvalidValueException;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface AuthRepository extends JpaRepository<User, Long> {

    default User findUserById(Long id) {
        return findById(id)
            .orElseThrow(() -> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND));
    }

    @Query("SELECT u FROM User u WHERE u.email = :email")
    User findUserByEmail(String email);

    default boolean existsUserByEmail(String email) {
        if (findUserByEmail(email) != null) throw new InvalidValueException(ErrorCode.DUPLICATE_EMAIL);
        return true;
    }

    @Query("SELECT u FROM User u WHERE u.email = :email AND u.userId = :userId")
    User findUserByEmailAndUserId(@Param("email") String email, @Param("userId") String userId);

    @Query("SELECT u FROM User u WHERE u.userId = :userId ")
    User findByUserId(@Param("userId") String userId);

    @Query("""
        SELECT u
        FROM User u
        WHERE u.role = 'CONSULTANT'
        ORDER BY 
            (SELECT COUNT(cr) FROM ChattingRoom cr WHERE cr.consultant = u) DESC, 
            u.createdAt DESC
    """)
    Page<User> findTopConsultants(Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role = 'CONSULTANT'")
    Page<User> findConsultants(PageRequest pageRequest);

    @Query("""
        SELECT u
        FROM User u
        WHERE u.role = 'CONSULTANT'
        AND (:search IS NULL OR u.nickname LIKE %:search%)
        AND (:gender IS NULL OR u.gender = :gender)
        AND (:availableDays IS NULL OR u.availableDays = :availableDays)
        ORDER BY 
            (SELECT COUNT(cr) FROM ChattingRoom cr WHERE cr.consultant = u) DESC, 
            u.createdAt DESC
    """)
    Page<User> findConsultantsBySearch(
        @Param("search") String search,
        @Param("gender") Gender gender,
        @Param("availableDays") AvailableDays availableDays,
        Pageable pageable
    );

    @Query("SELECT u FROM User u WHERE u.id = :consultantId AND u.role = 'CONSULTANT'")
    User findConsultantById(@Param("consultantId") Long consultantId);

    default boolean existsConsultantById(Long consultantId) {
        if (findConsultantById(consultantId) != null) throw new EntityNotFoundException(ErrorCode.CONSULTANT_NOT_FOUND);
        return true;
    }

    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.totalRating = :totalRating WHERE u.id = :userId")
    void updateTotalRating(@Param("userId") Long userId, @Param("totalRating") Double totalRating);
}
