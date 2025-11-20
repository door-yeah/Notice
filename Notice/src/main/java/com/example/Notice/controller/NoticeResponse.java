package com.example.Notice.controller;


import com.example.Notice.data.NoticeData;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class NoticeResponse {

    private Long id;

    private String title;

    private String author;

    private String content;

    private LocalDateTime createdAt;

    //dto -> response
    public NoticeResponse(NoticeData entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.author = entity.getAuthor();
        this.content = entity.getContent();
        this.createdAt = entity.getCreatedDate();
    }
}
