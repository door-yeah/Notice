package com.example.Notice.dto;

import com.example.Notice.data.NoticeData;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// 클라이언트에서 컨트롤러로
@Getter
@Setter
@NoArgsConstructor
public class NoticeRequest {

    private String title;

    private String author;

    private String content;

    //클라이언트에서 온 요청을 엔티티로 변경
    public NoticeData ToEntity() {
        return NoticeData.createNotice(title, author, content);
    }
}