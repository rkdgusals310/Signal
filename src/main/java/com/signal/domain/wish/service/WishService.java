package com.signal.domain.wish.service;

import com.signal.domain.auth.model.User;
import com.signal.domain.auth.repository.AuthRepository;
import com.signal.domain.wish.model.Wish;
import com.signal.domain.wish.repository.WishRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class WishService {

    private final AuthRepository authRepository;
    private final WishRepository wishRepository;

    public String wishConsultant(Long consultantId, Long userId) {
        User consultant = authRepository.findUserById(consultantId);
        User user = authRepository.findUserById(userId);

        if(wishRepository.existsWishById(consultantId, userId)) {
            Wish wish = wishRepository.findWishByConsultantIdAndUserId(consultantId, userId);
            wishRepository.delete(wish);
            return "Unwish Success";
        } else {
            Wish wish = Wish.create(user, consultant);
            wishRepository.save(wish);
            return "Wish Success";
        }
    }
}
