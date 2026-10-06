
package com.student.student_management.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        System.out.println("Request URI: " + request.getRequestURI());
        System.out.println("Authorization header present: "
                + (header != null && header.startsWith("Bearer ")));

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            try {
                String email = jwtService.extractEmail(token);

                System.out.println("JWT email extracted: " + email);

                if (email != null
                        && SecurityContextHolder.getContext()
                                .getAuthentication() == null
                        && jwtService.isTokenValid(token, email)) {

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    email,
                                    null,
                                    List.of(
                                            new SimpleGrantedAuthority("ROLE_USER")
                                    )
                            );

                    SecurityContextHolder.getContext()
                            .setAuthentication(authentication);

                    System.out.println("JWT authentication successful");

                } else {
                    System.out.println(
                            "JWT authentication not established");
                }

            } catch (Exception ex) {
                System.out.println("JWT validation failed: "
                        + ex.getClass().getSimpleName());

                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}