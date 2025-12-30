package com.example.Notice.exception;


import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException e) {

    Map<String, String> response = new HashMap<>();
    response.put("errorType", "Not Found");
    response.put("message", e.getMessage());

    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
  }

  @ExceptionHandler(IllegalStateException.class)
  public ResponseEntity<Map<String, String>> handleIllegalState(IllegalStateException e) {
    Map<String, String> response = new HashMap<>();
    response.put("errorType", "Unauthorized");
    response.put("message", e.getMessage());

    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
  }
}
