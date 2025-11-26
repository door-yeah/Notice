package com.example.Notice.controller;


import com.example.Notice.service.CommentService;
import com.example.Notice.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comment")
@CrossOrigin(origins = "*")
public class CommentController {

    private final CommentService commentService;

}
