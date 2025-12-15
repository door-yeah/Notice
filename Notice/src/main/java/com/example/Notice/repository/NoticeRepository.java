package com.example.Notice.repository;

import com.example.Notice.data.NoticeData;
import com.example.Notice.dto.NoticeResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// 게시판 저장소
@Repository
public interface NoticeRepository extends JpaRepository<NoticeData, Long> {
    public Page<NoticeData> findByTitleContaining(String keyword, Pageable pageable);
}