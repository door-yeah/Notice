package com.example.Notice.controller;


import com.example.Notice.data.NoticeData;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class NoticeResponse {

    private Long id;

    private String title;

    private String author;

    private String content;

    //dto -> response
    public NoticeResponse(NoticeData entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.author = entity.getAuthor();
        this.content = entity.getContent();
    }
}
