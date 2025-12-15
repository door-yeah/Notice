package com.example.Notice.controller;


import com.example.Notice.dto.CommentRequest;
import com.example.Notice.dto.CommentResponse;
import com.example.Notice.dto.NoticeResponse;
import com.example.Notice.service.CommentService;
import com.example.Notice.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {


    private final CommentService commentService;

    @PostMapping
    public CommentResponse createComment(@RequestBody CommentRequest data){
        return commentService.saveComment(data);
    }

    @GetMapping
    public List<CommentResponse> findAllComments(@RequestParam Long noticeId){
        return commentService.findAllByNoticeId(noticeId);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<String> updateComment(@PathVariable Long id, @RequestBody CommentRequest data){

        try {
            commentService.updateComment(id, data);

            return ResponseEntity.ok("댓글이 성공적으로 삭제되었습니다");
        }
        catch (IllegalArgumentException e) {
            // 예외 1: 댓글이 없는 경우 -> 404 Not Found
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (IllegalStateException e) {
            // 예외 2: 비밀번호가 틀린 경우 -> 401 Unauthorized (혹은 403 Forbidden)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteComment(@PathVariable Long id, @RequestBody Map<String,String> input) {
        try {
            commentService.deleteCommentById(id,input.get("password"));

            return ResponseEntity.ok("댓글이 성공적으로 삭제되었습니다");
        }
        catch (IllegalArgumentException e) {
            // 예외 1: 댓글이 없는 경우 -> 404 Not Found
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (IllegalStateException e) {
            // 예외 2: 비밀번호가 틀린 경우 -> 401 Unauthorized (혹은 403 Forbidden)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

}
