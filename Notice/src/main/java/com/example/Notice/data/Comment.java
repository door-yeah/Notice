package com.example.Notice.data;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String writer;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notice_id")
    private NoticeData notice;


    @Builder
//    Comment comment = Comment.builder()
//            .writer(this.writer)
//            .content(this.content)
//            .notice(noticeData)
//            .build();
    public Comment(String content, String writer, String password, NoticeData notice) {
        this.content = content;
        this.writer = writer;
        this.password = password;
        this.notice = notice;
    }

    public void updateComment(String Newcontent) {
        this.content = Newcontent;
    }
}
