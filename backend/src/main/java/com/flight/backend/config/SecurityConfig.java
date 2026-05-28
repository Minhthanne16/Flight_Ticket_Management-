package com.flight.backend.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.flight.backend.security.jwt.JwtFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

   @Bean
SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) 
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> 
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                    //PUBLIC ENDPOINTS
                    .requestMatchers("/auth/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/admin/airports/**").permitAll()

                    .requestMatchers("/orders/**").hasAnyRole("CUSTOMER", "ADMIN", "STAFF")  
                    .requestMatchers("/reports/**").hasAnyRole("ADMIN", "STAFF")
                    .requestMatchers("/admin/**").hasRole("ADMIN")

                    // ================= CONFIG =================
                    .requestMatchers(HttpMethod.GET, "/configs", "/configs/**").hasAnyRole("ADMIN", "STAFF")

                    .requestMatchers(HttpMethod.POST, "/configs", "/configs/**").hasRole("ADMIN")

                    .requestMatchers(HttpMethod.PUT, "/configs", "/configs/**").hasRole("ADMIN")

                    .requestMatchers(HttpMethod.DELETE, "/configs", "/configs/**").hasRole("ADMIN")

                    // ================= STAFF =================
                    .requestMatchers("/staffs","/staffs/**").hasRole("ADMIN")

                    .requestMatchers(HttpMethod.POST, "/vouchers/apply").hasRole("CUSTOMER")
                    .requestMatchers("/vouchers", "/vouchers/", "/vouchers/**").hasAnyRole("ADMIN", "STAFF")
                    .anyRequest().authenticated())
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    
    configuration.addAllowedOriginPattern("*");
    
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
    
    configuration.setExposedHeaders(Arrays.asList("Authorization"));
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
}
