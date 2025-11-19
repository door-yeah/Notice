package com.example.Notice.controller;

import com.example.Notice.data.NoticeData;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;


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