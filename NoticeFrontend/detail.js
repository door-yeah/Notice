/**
 * detail.js
 * 스프링 백엔드와 통신하여 게시글 상세 및 댓글 기능을 처리합니다.
 */

// 1. URL에서 글 번호(ID) 가져오기
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

// 2. HTML 요소 선택 (게시글 영역)
const viewTitle = document.getElementById('post-title');
const viewAuthor = document.getElementById('post-author');
const viewDate = document.getElementById('post-date');
const viewContent = document.getElementById('post-content');

// 3. HTML 요소 선택 (모달 및 게시글 버튼)
const editModal = document.getElementById('editModal');
const editTitleInput = document.getElementById('edit-title');
const editAuthorInput = document.getElementById('edit-author');
const editContentInput = document.getElementById('edit-content');

const editOpenBtn = document.getElementById('edit-open-btn');
const deleteBtn = document.getElementById('delete-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');
const modalSaveBtn = document.getElementById('modal-save-btn');

// 4. HTML 요소 선택 (댓글 영역) - [수정] 비밀번호 입력창 추가
const cmtWriterInput = document.getElementById('cmt-writer');
const cmtPasswordInput = document.getElementById('cmt-password'); // 추가됨
const cmtContentInput = document.getElementById('cmt-content');
const cmtSaveBtn = document.getElementById('cmt-save-btn');
const cmtListArea = document.getElementById('comment-list-area');


// ========================================================
//  기능 1: 페이지 로드 시 상세 정보 + 댓글 가져오기
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
  if (!postId) {
    alert("잘못된 접근입니다. (ID 없음)");
    window.location.href = 'main.html';
    return;
  }
  fetchPostDetail();
  fetchComments(); // 댓글 목록도 바로 로드
});

function fetchPostDetail() {
  fetch(`http://localhost:8080/api/notice/${postId}`)
    .then(response => {
      if (!response.ok) throw new Error("게시글을 찾을 수 없습니다.");
      return response.json();
    })
    .then(data => {
      viewTitle.innerText = data.title;
      viewAuthor.innerText = "작성자: " + data.author;
      viewContent.innerText = data.content;
      if (data.createdAt) {
        viewDate.innerText = data.createdAt.split('T')[0];
      } else {
        viewDate.innerText = "날짜 정보 없음";
      }
    })
    .catch(error => {
      console.error(error);
      alert("글을 불러오지 못했습니다.");
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
        window.location.href = 'main.html';
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
//  기능 3: 게시글 수정 (모달 & PATCH)
// ========================================================
editOpenBtn.addEventListener('click', () => {
  editTitleInput.value = viewTitle.innerText;
  editAuthorInput.value = viewAuthor.innerText.replace('작성자: ', '');
  editContentInput.value = viewContent.innerText;
  editModal.style.display = 'flex';
});

modalCancelBtn.addEventListener('click', () => {
  editModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === editModal) editModal.style.display = 'none';
});

modalSaveBtn.addEventListener('click', () => {
  const updateData = {
    title: editTitleInput.value,
    author: editAuthorInput.value,
    content: editContentInput.value
  };

  fetch(`http://localhost:8080/api/notice/${postId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData)
  })
    .then(response => {
      if (response.ok) {
        alert("수정이 완료되었습니다!");
        editModal.style.display = 'none';
        fetchPostDetail();
      } else {
        alert("수정 실패!");
      }
    })
    .catch(err => {
      console.error(err);
      alert("서버 통신 오류");
    });
});


// ========================================================
//  기능 4: 댓글 관련 기능 (목록, 등록, 삭제)
// ========================================================

// 1) 댓글 목록 불러오기 (GET)
function fetchComments() {
  fetch(`http://localhost:8080/api/comments?noticeId=${postId}`)
    .then(res => res.json())
    .then(data => {
      cmtListArea.innerHTML = '';

      if (data.length === 0) {
        cmtListArea.innerHTML = '<p style="color:#999; text-align:center; padding: 20px;">아직 댓글이 없습니다.</p>';
        return;
      }

      data.forEach(cmt => {
        const row = `
            <div style="border-bottom: 1px solid #eee; padding: 15px 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                    <div>
                        <strong style="color: #333; margin-right: 10px;">${cmt.writer}</strong>
                        <span style="color: #aaa; font-size: 0.8em;">${cmt.createdDate || ''}</span>
                    </div>
                    <button onclick="deleteComment(${cmt.id})"
                            style="background-color: #ff6b6b; color: white; border: none; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        삭제
                    </button>
                </div>
                <div style="color: #555;">${cmt.content}</div>
            </div>
        `;
        cmtListArea.insertAdjacentHTML('beforeend', row);
      });
    })
    .catch(err => console.error("댓글 로드 실패:", err));
}

// 2) 댓글 등록 (POST) - [수정됨] 비밀번호 처리 추가
cmtSaveBtn.addEventListener('click', () => {
  const writer = cmtWriterInput.value;
  const content = cmtContentInput.value;
  const password = cmtPasswordInput.value; // [추가] 비밀번호 값 가져오기

  // 유효성 검사 (빈칸 막기)
  if (!writer.trim() || !content.trim() || !password.trim()) {
    alert("작성자, 내용, 비밀번호를 모두 입력해주세요!");
    return;
  }

  const data = {
    noticeId: postId,
    writer: writer,
    content: content,
    password: password // [추가] DTO에 맞게 비밀번호 전송
  };

  fetch('http://localhost:8080/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (response.ok) {
        alert("댓글 등록 완료!");
        // 입력창 비우기
        cmtContentInput.value = '';
        cmtWriterInput.value = ''; // (선택사항) 작성자도 비울지 말지 결정
        cmtPasswordInput.value = ''; // [추가] 비밀번호 비우기

        fetchComments(); // 목록 갱신
      } else {
        alert("등록 실패");
      }
    })
    .catch(error => {
      console.error("에러:", error);
      alert("서버 오류");
    });
});

// 3) 댓글 삭제 (DELETE) - [수정됨] 비밀번호 확인 로직 추가
function deleteComment(commentId) {
  // 1. 사용자에게 비밀번호 입력받기
  const password = prompt("댓글 삭제를 위해 비밀번호를 입력해주세요.");

  // 취소 눌렀거나 빈 값이면 중단
  if (!password) {
    return;
  }

  // 2. 서버로 요청 보내기 (비밀번호를 Body에 담아서)
  fetch(`http://localhost:8080/api/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json' // JSON 보낸다고 명시
    },
    body: JSON.stringify({
      password: password // Map<String,String> 또는 DTO가 받음
    })
  })
    .then(async response => {
      // 3. 결과 처리
      if (response.ok) {
        // 200 OK
        alert("삭제되었습니다.");
        fetchComments(); // 화면 갱신
      } else {
        // 401(비번틀림) or 404(없음) -> 서버 메시지 출력
        const errorMessage = await response.text();
        alert(errorMessage);
      }
    })
    .catch(error => {
      console.error("통신 에러:", error);
      alert("서버와 연결할 수 없습니다.");
    });
}

function fetchComments() {
  fetch(`http://localhost:8080/api/comments?noticeId=${postId}`)
    .then(res => res.json())
    .then(data => {
      cmtListArea.innerHTML = '';

      if (data.length === 0) {
        cmtListArea.innerHTML = '<p style="color:#999; text-align:center; padding: 20px;">아직 댓글이 없습니다.</p>';
        return;
      }

      data.forEach(cmt => {
        // ▼▼▼ 여기서부터 수정됨 ▼▼▼
        // 1. 기존 내용에 따옴표가 있으면 오류가 날 수 있으니 안전하게 처리 (선택사항)
        // 2. 수정 버튼 추가 (초록색)
        const row = `
            <div style="border-bottom: 1px solid #eee; padding: 15px 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                    <div>
                        <strong style="color: #333; margin-right: 10px;">${cmt.writer}</strong>
                        <span style="color: #aaa; font-size: 0.8em;">${cmt.createdDate || ''}</span>
                    </div>

                    <div>
                        <button onclick="updateComment(${cmt.id}, '${cmt.content.replace(/'/g, "\\'")}')"
                                style="background-color: #4CAF50; color: white; border: none; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-right: 5px;">
                            수정
                        </button>

                        <button onclick="deleteComment(${cmt.id})"
                                style="background-color: #ff6b6b; color: white; border: none; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                            삭제
                        </button>
                    </div>
                </div>
                <div style="color: #555;">${cmt.content}</div>
            </div>
        `;
        // ▲▲▲ 수정 끝 ▲▲▲

        cmtListArea.insertAdjacentHTML('beforeend', row);
      });
    })
    .catch(err => console.error("댓글 로드 실패:", err));
}

// detail.js 맨 아래에 추가

/**
 * 댓글 수정 함수
 * @param {number} commentId - 수정할 댓글 ID
 * @param {string} oldContent - (선택) 기존 댓글 내용
 */
function updateComment(commentId, oldContent) {
  // 1. 비밀번호 입력 받기
  const password = prompt("댓글 수정을 위해 비밀번호를 입력해주세요.");

  // 취소 눌렀으면 중단
  if (!password) return;

  // 2. 바꿀 내용 입력 받기 (기존 내용을 기본값으로 넣어줌)
  const newContent = prompt("수정할 내용을 입력해주세요.", oldContent);

  // 내용이 없거나 취소했으면 중단
  if (!newContent) return;

  // 3. 서버로 PATCH 요청 보내기
  fetch(`http://localhost:8080/api/comments/${commentId}`, {
    method: 'PATCH', // 수정은 보통 PATCH나 PUT 사용
    headers: {
      'Content-Type': 'application/json'
    },
    // DTO나 Map 구조에 맞춰서 데이터 전송
    body: JSON.stringify({
      password: password, // 검증용 비밀번호
      content: newContent // 바꿀 새 내용
    })
  })
    .then(async response => {
      if (response.ok) {
        alert("댓글이 수정되었습니다.");
        fetchComments(); // 목록 다시 불러오기 (화면 갱신)
      } else {
        // 401(비번 틀림) 등 에러 메시지 출력
        const msg = await response.text();
        alert(msg);
      }
    })
    .catch(error => {
      console.error("수정 중 오류:", error);
      alert("서버 연결에 실패했습니다.");
    });
}
