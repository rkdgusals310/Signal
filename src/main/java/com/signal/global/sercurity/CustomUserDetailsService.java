package com.signal.global.sercurity;

import com.signal.domain.auth.repository.AuthRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.signal.domain.auth.model.User;

import lombok.RequiredArgsConstructor;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
	
	private final AuthRepository authRepository;

	@Override
	public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
		
		User userData=authRepository.findByUserId(userId);
		
		if(userData!=null) {
			log.info("User found with userId: {}", userId);
			log.info("UserData : {}", userData);
			return new CustomUserDetails(userData); 
		}
		log.warn("No user found with userId: {}", userId);
		throw new UsernameNotFoundException(userId);
	}
}
