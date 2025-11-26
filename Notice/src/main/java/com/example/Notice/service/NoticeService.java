package com.example.Notice.service;


import com.example.Notice.dto.NoticeRequest;
import com.example.Notice.dto.NoticeResponse;
import com.example.Notice.data.NoticeData;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.Notice.repository.NoticeRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository; //@RequiredArgsConstructor로 인해 오토와이어드 됨

    @Transactional(readOnly = true)
    public List<NoticeResponse> findAllDatas() {
        return noticeRepository.findAll().stream().map(NoticeResponse::new).collect(Collectors.toList());
    }

    @Transactional
    public NoticeResponse SaveData(NoticeRequest data) {
        NoticeData noticeData = data.ToEntity();
        NoticeData result = noticeRepository.save(noticeData);
        return new NoticeResponse(result);
    }

    @Transactional
    public void DeleteDataById(Long id) {
        noticeRepository.deleteById(id);
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
