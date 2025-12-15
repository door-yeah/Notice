package com.example.Notice.service;


import com.example.Notice.dto.NoticeRequest;
import com.example.Notice.dto.NoticeResponse;
import com.example.Notice.data.NoticeData;
import com.example.Notice.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.Notice.repository.NoticeRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository; //@RequiredArgsConstructor로 인해 오토와이어드 됨
    private final NoticeRepository CommentRepository;
    private final CommentRepository commentRepository;

    // 스트림으로 모든 데이터 보여줌
    @Transactional(readOnly = true)
    public Page<NoticeResponse> findAllDatas(Pageable pageable) {
        //return noticeRepository.findAll().stream().map(NoticeResponse::new).collect(Collectors.toList());
        //Page<NoticeData> noticedata = noticeRepository.findAll(pageable);
        return noticeRepository.findAll(pageable).map(NoticeResponse::new);
    }


    @Transactional
    public NoticeResponse SaveData(NoticeRequest data) {
        // dto를 엔티티로 바꿈
        NoticeData noticeData = data.ToEntity();
        NoticeData result = noticeRepository.save(noticeData);
        // 엔티티를 dto로 바꿈
        return new NoticeResponse(result);
    }

    //JDBC로 지움
    @Transactional
    public void DeleteDataById(Long id) {
        noticeRepository.deleteById(id);
        commentRepository.deleteAllByNoticeId(id);
    }

    @Transactional
    public NoticeResponse findById(Long id) {
        NoticeResponse noticeResponse = new NoticeResponse(noticeRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("해당 ID가 없습니다. id="+id)
        ));
        return noticeResponse;
    }

    @Transactional
    public NoticeResponse UpdateData(Long id, NoticeRequest data) {
        NoticeData noticeData = noticeRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("해당 id가 없습니다. id="+id)
        );
        noticeData.update(data);
        NoticeResponse result = new NoticeResponse(noticeData);
        return result;
    }
}
