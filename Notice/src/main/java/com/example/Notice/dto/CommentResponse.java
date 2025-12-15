package com.example.Notice.dto;


import com.example.Notice.data.Comment;
import lombok.Getter;

import java.time.format.DateTimeFormatter;


@Getter
public class CommentResponse {

    private Long id;
    private String writer;
    private String content;
    private String createdDate;
    private String password;

    public CommentResponse(Comment comment) {
        this.id = comment.getId();
        this.writer = comment.getWriter();
        this.content = comment.getContent();
        if (comment.getCreatedAt() != null) {
            this.createdDate = comment.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        }
    }
}
