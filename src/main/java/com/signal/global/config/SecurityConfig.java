package com.signal.global.config;

import com.signal.global.sercurity.CustomAuthenticationFailureHandler;
import com.signal.global.sercurity.CustomAuthenticationSuccessHandler;
import com.signal.global.sercurity.CustomUserDetailsService;
import java.util.Arrays;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

@Slf4j
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final String[] swagger = {
        "/open-api/**",
        "/resources/**",
        "/error",
        "/swagger-resources/**",
        "/swagger-ui/index.html",
        "/swagger-ui/**",
        "/v3/api-docs/**",
        "/v3/api-docs"
    };

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder(); //암호화 메서드

    }


    @Bean // 커스텀으로 시큐리티 작성시 필요한 필터들은 활성화시켜야함/ 비활성화도 마찬가지
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		http
			.csrf(csrf -> csrf.disable());

    	http //인가
    		.authorizeHttpRequests((auth)-> auth
    				.requestMatchers(swagger).permitAll()
    				.requestMatchers("/api/auth/consultant/**","/api/consultant/**").hasRole("CONSULTANT")
    				.requestMatchers("/api/auth/user/**","/api/user/**","/api/member/**").hasRole("USER")
    				.requestMatchers("/api/auth/edit/**").hasAnyRole("USER","CONSULTANT")
    				.requestMatchers("/api/common/**","/api/auth/**").permitAll()
    				.anyRequest().authenticated());

    	http
    	.formLogin((auth)->auth
				.loginPage("/api/auth/login")
    			.loginProcessingUrl("/loginProc") // 프론트 폼 액션값이랑 일치해야함
				.usernameParameter("userId")
				.successHandler(new CustomAuthenticationSuccessHandler())
				.failureHandler(new CustomAuthenticationFailureHandler())
    			.permitAll());

    	http
    		.logout((auth)->auth.logoutUrl("/api/auth/logout")
    				.logoutSuccessUrl("/")); // 로그아웃 후 리다이렉트 경로

    	//cors
    	http
        .cors(cors -> cors.configurationSource(request -> {
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowedOrigins(Arrays.asList("http://localhost:8080","http://localhost:3000"));  // CORS 허용 도메인 설정
            config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));      // 허용할 HTTP 메서드 설정
            config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));     // 허용할 요청 헤더 설정
			return config;
        }));



    	// 세션 관련
    	http
    		.sessionManagement((auth)->auth
    				.maximumSessions(3)
    				.maxSessionsPreventsLogin(true));
    	http
    		.sessionManagement((auth)->auth
    				.sessionFixation().changeSessionId());

        return http.build();
    }

    /*

    @Bean //필터를 거칠필요 없는경우
    public WebSecurityCustomizer webSecurityCustomizer() {

        return web -> web.ignoring().requestMatchers("/img/**");
    }
    */

}
