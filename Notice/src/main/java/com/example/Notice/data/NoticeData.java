package com.example.Notice.data;


import com.example.Notice.dto.NoticeRequest;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@EntityListeners(AuditingEntityListener.class) // 저장시간 확인
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NoticeData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //DB가 알아서 번호를 매겨 줌
    private long Id;

    // 제목
    @Column(nullable = false)
    private String title;

    // 작성자
    @Column(nullable = false)
    private String author;

    // 내용
    @Lob
    @Column(nullable = false)
    private String content;

    // 작성일자
    @CreatedDate //시간이 자동으로 들어감
    @Column(updatable = false)
    private LocalDateTime createdDate;

    // 수정
    public void update(NoticeRequest data) {
        this.title = data.getTitle();
        this.author = data.getAuthor();
        this.content = data.getContent();
    }

    // 생성
    public static NoticeData createNotice(String title, String author, String content) {
        NoticeData notice = new NoticeData();
        notice.title = title;
        notice.author = author;
        notice.content = content;
        return notice;
    }

    @OneToMany(mappedBy = "notice", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();
}
