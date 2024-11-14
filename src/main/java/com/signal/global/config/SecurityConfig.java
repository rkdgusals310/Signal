package com.signal.global.config;

import com.signal.global.sercurity.CustomAuthenticationFailureHandler;
import com.signal.global.sercurity.CustomAuthenticationSuccessHandler;
import com.signal.global.sercurity.CustomUserDetailsService;
import java.util.Arrays;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Slf4j
@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final String[] swagger = { "/open-api/**", "/resources/**", "/error", "/swagger-resources/**",
			"/swagger-ui/index.html", "/swagger-ui/**", "/v3/api-docs/**", "/v3/api-docs" };

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder(); // 암호화 메서드
	}

	@Bean // 시큐리티 필터 체인 설정
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable()) // CSRF 비활성화

            .authorizeHttpRequests((auth) -> auth
                .requestMatchers(swagger).permitAll() // Swagger 관련 요청 허용
//                .requestMatchers("/api/auth/consultant/**", "/api/consultant/**").hasRole("CONSULTANT")
//                .requestMatchers("/api/auth/user/**", "/api/user/**", "/api/member/**").hasRole("USER")
                .requestMatchers("/api/auth/consultant/**", "/api/consultant/**").permitAll()
                .requestMatchers("/api/auth/user/**", "/api/user/**", "/api/member/**").permitAll()
                .requestMatchers("/api/auth/edit/**").hasAnyRole("USER", "CONSULTANT")
                .requestMatchers("/api/common/**", "/api/auth/**").permitAll() // 공용 및 인증 관련 요청 허용
                .anyRequest().authenticated()
            );


    	http
    	.formLogin((auth)->auth
				.loginPage("/api/auth/login")
    			.loginProcessingUrl("/loginProc") // 프론트 폼 액션값이랑 일치해야함
				.usernameParameter("userId")
				.successHandler(new CustomAuthenticationSuccessHandler())
				.failureHandler(new CustomAuthenticationFailureHandler())
    			.permitAll()
    			);

        http
            .logout((auth) -> auth
                .logoutUrl("/api/auth/logout")
                .logoutSuccessUrl("/") // 로그아웃 후 리다이렉트 경로
            );

    	
        http

            .cors(cors -> cors.configurationSource(corsConfigurationSource())) ;// CORS 설정
    
        
     // 세션 관련
    	http
    		.sessionManagement((auth)->auth
    				.maximumSessions(3)
    				.maxSessionsPreventsLogin(true));
    	http
    		.sessionManagement((auth)->auth
    				.sessionFixation().changeSessionId());

        return http.build();
        

    	//cors
//    	http
//        .cors(cors -> cors.configurationSource(request -> {
//            CorsConfiguration config = new CorsConfiguration();
//			config.setAllowCredentials(true);
//            config.setAllowedOrigins(Arrays.asList("http://localhost:8080","http://localhost:3000"));  // CORS 허용 도메인 설정
//            config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));      // 허용할 HTTP 메서드 설정
//            config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));     // 허용할 요청 헤더 설정
//			return config;
//        })); 
        
    }

//    // 글로벌 CORS 설정
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:8080", "http://localhost:3000")); // 허용할 도메인
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // 허용할 HTTP 메서드
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type")); // 허용할 요청 헤더
        configuration.setAllowCredentials(true); // 쿠키 허용
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

	/*
	 * @Bean //필터를 거칠 필요 없는 경우 public WebSecurityCustomizer webSecurityCustomizer()
	 * { return web -> web.ignoring().requestMatchers("/img/**"); }
	 */
}
