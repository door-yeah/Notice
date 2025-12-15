package com.example.Notice.repository;

import com.example.Notice.data.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// 댓글 저장소
public interface CommentRepository extends JpaRepository<Comment, Long> {
   List<Comment> findByNoticeId(Long noticeId);
    void deleteAllByNoticeId(Long postId);
}
