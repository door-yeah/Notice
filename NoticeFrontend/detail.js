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
