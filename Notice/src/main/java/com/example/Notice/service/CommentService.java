package com.example.Notice.service;

import com.example.Notice.data.Comment;
import com.example.Notice.data.NoticeData;
import com.example.Notice.dto.CommentRequest;
import com.example.Notice.dto.CommentResponse;
import com.example.Notice.dto.NoticeResponse;
import com.example.Notice.repository.CommentRepository;
import com.example.Notice.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final NoticeRepository noticeRepository;

    //댓글 받는거
    @Transactional
    public CommentResponse saveComment(CommentRequest commentRequest) {
        NoticeData notice = noticeRepository.findById(commentRequest.getNoticeId())
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다."));
        Comment comment = commentRequest.toComment(notice);
        commentRepository.save(comment);
        return new CommentResponse(comment);
    }

//    @Transactional(readOnly = true)
//    public List<NoticeResponse> findAllDatas() {
//        return noticeRepository.findAll().stream().map(NoticeResponse::new).collect(Collectors.toList());
//    }

    @Transactional(readOnly = true)
    public List<CommentResponse> findAllByNoticeId(Long noticeId) {
        List<Comment> comments = commentRepository.findByNoticeId(noticeId);
        return comments.stream()
                .map(CommentResponse::new)
                .collect(Collectors.toList());
    }
}
