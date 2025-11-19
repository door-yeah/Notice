package com.example.Notice.repository;

import com.example.Notice.data.NoticeData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoticeRepository extends JpaRepository<NoticeData, Long> {
}