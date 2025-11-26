/**
 * detail.js
 * 스프링 백엔드와 통신하여 게시글 상세 기능을 처리합니다.
 */

// 1. URL에서 글 번호(ID) 가져오기 (예: detail.html?id=1)
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

// 2. HTML 요소 선택 (뷰 영역)
const viewTitle = document.getElementById('post-title');
const viewAuthor = document.getElementById('post-author');
const viewDate = document.getElementById('post-date');
const viewContent = document.getElementById('post-content');

// 3. HTML 요소 선택 (모달 및 버튼)
const editModal = document.getElementById('editModal');
const editTitleInput = document.getElementById('edit-title');
const editAuthorInput = document.getElementById('edit-author');
const editContentInput = document.getElementById('edit-content');

const editOpenBtn = document.getElementById('edit-open-btn');   // [수정] 버튼
const deleteBtn = document.getElementById('delete-btn');        // [삭제] 버튼
const modalCancelBtn = document.getElementById('modal-cancel-btn'); // 모달 [취소]
const modalSaveBtn = document.getElementById('modal-save-btn');     // 모달 [수정 완료]


// ========================================================
//  기능 1: 페이지 로드 시 상세 정보 가져오기 (GET)
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
  if (!postId) {
    alert("잘못된 접근입니다. (ID 없음)");
    window.location.href = 'main.html'; // 목록으로 팅겨내기
    return;
  }
  fetchPostDetail();
});

function fetchPostDetail() {
  // 스프링 컨트롤러의 @GetMapping("/{id}") 호출
  fetch(`http://localhost:8080/api/notice/${postId}`)
    .then(response => {
      if (!response.ok) throw new Error("게시글을 찾을 수 없습니다.");
      return response.json();
    })
    .then(data => {
      // data = { id, title, author, content, createdDate } 라고 가정

      // 화면에 뿌리기
      viewTitle.innerText = data.title;
      viewAuthor.innerText = "작성자: " + data.author;
      viewContent.innerText = data.content;

      // 날짜 처리 (null 체크 후 T 앞부분만 자르기)
      if (data.createdAt) {
        viewDate.innerText = data.createdAt.split('T')[0];
      } else {
        viewDate.innerText = "날짜 정보 없음";
      }
    })
    .catch(error => {
      console.error(error);
      alert("글을 불러오지 못했습니다.");
      viewTitle.innerText = "삭제되었거나 존재하지 않는 글입니다.";
    });
}


// ========================================================
//  기능 2: 게시글 삭제 (DELETE)
// ========================================================
deleteBtn.addEventListener('click', () => {
  if (!confirm("정말 이 게시글을 삭제하시겠습니까?")) return;

  fetch(`http://localhost:8080/api/notice/${postId}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (response.ok) {
        alert("삭제되었습니다.");
        window.location.href = 'main.html'; // 목록 페이지로 이동
      } else {
        alert("삭제 실패! (서버 오류)");
      }
    })
    .catch(err => {
      console.error(err);
      alert("오류가 발생했습니다.");
    });
});


// ========================================================
//  기능 3: 수정 모달 제어
// ========================================================

// 1) 수정 버튼 누르면 -> 모달 열고 데이터 채워넣기
editOpenBtn.addEventListener('click', () => {
  // 현재 보고 있는 내용을 입력창에 옮김
  editTitleInput.value = viewTitle.innerText;
  // "작성자: 홍길동"에서 "홍길동"만 추출
  editAuthorInput.value = viewAuthor.innerText.replace('작성자: ', '');
  editContentInput.value = viewContent.innerText;

  editModal.style.display = 'flex'; // 모달 보이기
});

// 2) 취소 버튼 -> 닫기
modalCancelBtn.addEventListener('click', () => {
  editModal.style.display = 'none';
});

// 3) 검은 배경 클릭 -> 닫기
window.addEventListener('click', (e) => {
  if (e.target === editModal) {
    editModal.style.display = 'none';
  }
});


// ========================================================
//  기능 4: 수정 내용 저장 (PATCH)
// ========================================================
modalSaveBtn.addEventListener('click', () => {
  // 보낼 데이터 준비 (DTO 구조에 맞춤)
  const updateData = {
    title: editTitleInput.value,
    author: editAuthorInput.value,
    content: editContentInput.value
  };

  fetch(`http://localhost:8080/api/notice/${postId}`, {
    method: 'PATCH', // 컨트롤러가 @PatchMapping 이므로
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData) // JSON으로 변환해서 전송
  })
    .then(response => {
      if (response.ok) {
        alert("수정이 완료되었습니다!");
        editModal.style.display = 'none'; // 모달 닫기
        fetchPostDetail(); // 바뀐 내용으로 화면 다시 그리기 (새로고침 효과)
      } else {
        alert("수정 실패!");
      }
    })
    .catch(err => {
      console.error(err);
      alert("서버 통신 오류");
    });
});


// detail.js

// 1. 요소 선택
const cmtWriterInput = document.getElementById('cmt-writer');
const cmtContentInput = document.getElementById('cmt-content');
const cmtSaveBtn = document.getElementById('cmt-save-btn');
const cmtListArea = document.getElementById('comment-list-area'); // 댓글 목록 들어갈 곳

// 2. 페이지 로드 시 댓글 목록 불러오기
document.addEventListener('DOMContentLoaded', () => {
  fetchComments();
});

// 3. 댓글 목록 불러오는 함수 (GET)
function fetchComments() {
  // API 주소: /api/comments?noticeId=현재글번호
  fetch(`http://localhost:8080/api/comments?noticeId=${postId}`)
    .then(res => res.json())
    .then(data => {
      // 화면에 있는 기존 목록 싹 비우기 (초기화)
      cmtListArea.innerHTML = '';

      // 데이터가 없으면 안내 문구
      if (data.length === 0) {
        cmtListArea.innerHTML = '<p style="color:#999; text-align:center; padding: 20px;">아직 댓글이 없습니다.</p>';
        return;
      }

      // 받아온 최신 데이터로 다시 채워넣음 (스크린샷에서 {...}로 생략됐던 부분!)
      data.forEach(cmt => {
        const row = `
                    <div style="border-bottom: 1px solid #eee; padding: 15px 0;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <strong style="color: #333;">${cmt.writer}</strong>
                            <span style="color: #aaa; font-size: 0.8em;">${cmt.createdDate}</span>
                        </div>
                        <div style="color: #555;">${cmt.content}</div>
                    </div>
                `;
        // 만든 HTML을 목록 영역에 추가
        cmtListArea.insertAdjacentHTML('beforeend', row);
      });
    })
    .catch(err => console.error("댓글 로드 실패:", err));
}

// 4. [등록] 버튼 클릭 이벤트 (POST)
cmtSaveBtn.addEventListener('click', () => {
  const writer = cmtWriterInput.value;
  const content = cmtContentInput.value;

  // 유효성 검사 (빈칸 막기)
  if (!writer.trim() || !content.trim()) {
    alert("작성자와 내용을 모두 입력해주세요!");
    return;
  }

  // --- 스크린샷에서 짤렸던 부분 (서버 전송) 시작 ---

  // 보낼 데이터 포장
  const data = {
    noticeId: postId,
    writer: writer,
    content: content
  };

  // 서버로 전송
  fetch('http://localhost:8080/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (response.ok) {
        alert("댓글 등록 완료!");
        cmtContentInput.value = ''; // 입력창 비우기
        fetchComments(); // ★ 저장했으니 목록 다시 불러오기!
      } else {
        alert("등록 실패");
      }
    })
    .catch(error => {
      console.error("에러:", error);
      alert("서버 오류");
    });
  // --- 끝 ---
});
