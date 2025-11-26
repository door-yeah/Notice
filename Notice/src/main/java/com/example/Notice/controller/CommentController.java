package com.example.Notice.controller;


import com.example.Notice.dto.CommentRequest;
import com.example.Notice.dto.CommentResponse;
import com.example.Notice.dto.NoticeResponse;
import com.example.Notice.service.CommentService;
import com.example.Notice.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
