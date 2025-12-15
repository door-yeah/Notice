package com.example.Notice.controller;

import com.example.Notice.dto.NoticeRequest;
import com.example.Notice.dto.NoticeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.Notice.service.NoticeService;


import java.util.List;


@RestController // json으로 바꿔줌
@RequiredArgsConstructor
@RequestMapping("/api/notice")
@CrossOrigin(origins = "*")
public class NoticeController {

    private final NoticeService noticeService;

    // 모든 글 목록
//    @GetMapping //Get(조회) 요청이 오면 받음
//    public List<NoticeResponse> GetAllNotice() {
//        return noticeService.findAllDatas();
//    }

    // 모든 글 목록 (페이지는 전체 조회에서 특정 갯수만 잘라서 프론트에 넘겨주는 것)
    @GetMapping
    public ResponseEntity<Page<NoticeResponse>> getNotices(
            @PageableDefault(size = 5, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<NoticeResponse> list = noticeService.findAllDatas(pageable);
        return ResponseEntity.ok(list);
    }

    // 글 작성
    @PostMapping
    public NoticeResponse createData(@RequestBody NoticeRequest data) {
        return noticeService.SaveData(data);
    }

    // 글 삭제, 클라이언트에서 요청이 옴
    @DeleteMapping("/{id}")
    public void deleteData(@PathVariable Long id) {
        noticeService.DeleteDataById(id);
    }

    // 아이디에 따른 글 찾기
    @GetMapping("/{id}")
    public NoticeResponse GetDataById(@PathVariable Long id) {
        return noticeService.findById(id);
    }

    // 데이터 수정
    @PatchMapping("/{id}")
    public NoticeResponse updateData(@PathVariable Long id, @RequestBody NoticeRequest data) {
        return  noticeService.UpdateData(id, data);
    }


}
