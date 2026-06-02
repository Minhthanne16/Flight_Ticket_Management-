package com.flight.backend.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.flight.backend.dto.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationException(
            MethodArgumentNotValidException ex) {

        Map<String, Object> errors = new HashMap<>();
        var fieldError = ex.getBindingResult().getFieldErrors().get(0);

        String fieldName = fieldError.getField();
        String errorMessage = fieldError.getDefaultMessage();
        errors.put(fieldName, null);

        return ApiResponse.error(
                HttpStatus.BAD_REQUEST,
                errorMessage,
                "400");
    }

    // Sai email/mật khẩu (BadCredentialsException) -> thông báo tiếng Việt
    @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Object>> handleBadCredentials(
            org.springframework.security.authentication.BadCredentialsException ex) {
        return ApiResponse.error(
                HttpStatus.UNAUTHORIZED,
                "Sai email hoặc mật khẩu",
                "401");
    }

    // Tài khoản bị vô hiệu hóa
    @ExceptionHandler(org.springframework.security.authentication.DisabledException.class)
    public ResponseEntity<ApiResponse<Object>> handleDisabled(
            org.springframework.security.authentication.DisabledException ex) {
        return ApiResponse.error(
                HttpStatus.UNAUTHORIZED,
                "Tài khoản đã bị vô hiệu hóa",
                "401");
    }

    // Các lỗi xác thực khác
    @ExceptionHandler(org.springframework.security.core.AuthenticationException.class)
    public ResponseEntity<ApiResponse<Object>> handleAuthentication(
            org.springframework.security.core.AuthenticationException ex) {
        return ApiResponse.error(
                HttpStatus.UNAUTHORIZED,
                "Xác thực thất bại, vui lòng thử lại",
                "401");
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Object>> handleRuntimeException(RuntimeException ex) {
        return ApiResponse.error(
                HttpStatus.BAD_REQUEST,
                ex.getMessage(),
                "400");
    }

    // Không đủ quyền (từ @PreAuthorize trên method) -> thông báo tiếng Việt
    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Object>> handleAccessDenied(
            org.springframework.security.access.AccessDeniedException ex) {
        return ApiResponse.error(
                HttpStatus.FORBIDDEN,
                "Bạn không có quyền thực hiện thao tác này.",
                "403");
    }

    // Bắt mọi lỗi còn lại để luôn trả thông báo tiếng Việt cho người dùng
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGeneric(Exception ex) {
        return ApiResponse.error(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Đã xảy ra lỗi, vui lòng thử lại sau.",
                "500");
    }
}
