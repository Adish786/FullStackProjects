package com.user.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class RequestLoggingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;

        System.out.println("=== INCOMING REQUEST ===");
        System.out.println("Method: " + httpRequest.getMethod());
        System.out.println("URL: " + httpRequest.getRequestURL());
        System.out.println("URI: " + httpRequest.getRequestURI());
        System.out.println("Content Type: " + httpRequest.getContentType());
        System.out.println("Authorization: " + httpRequest.getHeader("Authorization"));

        chain.doFilter(request, response);

        HttpServletResponse httpResponse = (HttpServletResponse) response;
        System.out.println("Response Status: " + httpResponse.getStatus());
        System.out.println("=== END REQUEST ===");
    }
}
