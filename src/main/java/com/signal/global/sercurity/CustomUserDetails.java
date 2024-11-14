package com.signal.global.sercurity;

import com.signal.domain.auth.dto.response.UserDetailResponse;
import java.util.ArrayList;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.signal.domain.auth.model.User;


public class CustomUserDetails implements UserDetails {
	
	private User user;
	
	public CustomUserDetails(User user) {
		this.user=user;
	}

	public Long getUserId() {
		return user.getId();
	}

	public UserDetailResponse getUserDetails() {
		return UserDetailResponse.toDto(user);
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() { //사용자 특정권한
		Collection<GrantedAuthority> collection=new ArrayList<>();
		collection.add(new GrantedAuthority() {
			
			@Override
			public String getAuthority() {
				return "ROLE_" +user.getRole().name();
			}
		});
		return collection;
	}

	@Override
	public String getPassword() {
		
		return user.getPassword();
	}

	@Override
	public String getUsername() {
		
		return user.getUserId();
	}

}
