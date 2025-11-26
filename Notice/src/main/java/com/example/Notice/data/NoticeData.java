package com.example.Notice.data;


import com.example.Notice.dto.NoticeRequest;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NoticeData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //DB가 알아서 번호를 매겨 줌
    private long Id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    @Lob
    @Column(nullable = false)
    private String content;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdDate;

    public void update(NoticeRequest data) {
        this.title = data.getTitle();
        this.author = data.getAuthor();
        this.content = data.getContent();
    }

    public static NoticeData createNotice(String title, String author, String content) {
        NoticeData notice = new NoticeData();
        notice.title = title;
        notice.author = author;
        notice.content = content;
        return notice;
    }
}
