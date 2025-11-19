package com.example.Notice.controller;

import com.example.Notice.data.NoticeData;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.example.Notice.service.NoticeService;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notice")
@CrossOrigin(origins = "*")
public class NoticeController {

    private final NoticeService noticeService;

    @GetMapping//Get(조회) 요청이 오면 받음
    public List<NoticeResponse> GetAllNotice() {
        return noticeService.findAllDatas();
    }

    @PostMapping
    public NoticeResponse createData(@RequestBody NoticeRequest data) {
        return noticeService.SaveData(data);
    }

    @DeleteMapping("/{id}")
    public void deleteData(@PathVariable Long id) {
        noticeService.DeleteDataById(id);
    }

    @GetMapping("/{id}")
    public NoticeResponse GetDataById(@PathVariable Long id) {
        return noticeService.findById(id);
    }

    @PatchMapping("/{id}")
    public NoticeResponse updateData(@PathVariable Long id, @RequestBody NoticeRequest data) {
        return  noticeService.UpdateData(id, data);
    }

}
