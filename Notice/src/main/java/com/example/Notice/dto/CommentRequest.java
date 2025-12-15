package com.example.Notice.dto;

import com.example.Notice.data.Comment;
import com.example.Notice.data.NoticeData;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CommentRequest {
    private Long noticeId;
    private String writer;
    private String content;
    private String password;
    // dto에서 entity로
    public Comment toComment(NoticeData noticeData) {
        Comment comment = Comment.builder()
                .writer(this.writer)
                .content(this.content)
                .password(this.password)
                .notice(noticeData)
                .build();
        return comment;
    }
}
