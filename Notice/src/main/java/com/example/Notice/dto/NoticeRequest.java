package com.example.Notice.dto;

import com.example.Notice.data.NoticeData;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
public class NoticeRequest {


    private String title;

    private String author;

    private String content;

    public NoticeData ToEntity() {
        return NoticeData.createNotice(title, author, content);
    }
}