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

    // 댓글 받는거
    // 독립성과 일관성
    @Transactional
    public CommentResponse saveComment(CommentRequest commentRequest) {
        // 람다
        // orElseThrow 가 되면 이 식을 수행해라
        NoticeData notice = noticeRepository.findById(commentRequest.getNoticeId())
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다."));
        //dto를 엔티티로 전환
        Comment comment = commentRequest.toComment(notice);
        commentRepository.save(comment);
        return new CommentResponse(comment);
    }

//    @Transactional(readOnly = true)
//    public List<NoticeResponse> findAllDatas() {
//        return noticeRepository.findAll().stream().map(NoticeResponse::new).collect(Collectors.toList());
//    }

    // 변화를 할 수 없게 됨. 코드안에 변화를 넣어도 무시됨
    @Transactional(readOnly = true)
    public List<CommentResponse> findAllByNoticeId(Long noticeId) {
        List<Comment> comments = commentRepository.findByNoticeId(noticeId);
        return comments.stream()
                .map(CommentResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteCommentById(Long id, String input) {
        Comment comment = commentRepository.findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("댓글이 존재하지 않습니다"));
        if(comment.getPassword().equals(input)) {
            commentRepository.deleteById(id);
        }
        else {
            throw new IllegalStateException("비밀번호가 일치하지 않습니다.");
        }
    }

    @Transactional
    public void updateComment(Long id, CommentRequest commentRequest) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 댓글입니다."));
        if(!commentRequest.getPassword().equals(comment.getPassword())) {
            throw new IllegalStateException("비밀번호가 일치하지 않습니다.");
        }
        comment.updateComment(commentRequest.getContent());
    }
}
