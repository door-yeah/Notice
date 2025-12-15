// === 1. DOM 요소 선택 ===
const postListBody = document.getElementById('post-list-body');
const newPostButton = document.getElementById('new-post-btn');
const paginationArea = document.getElementById('pagination-area'); // [추가] 페이지 버튼 영역

// === 2. 이벤트 리스너 연결 ===
newPostButton.addEventListener('click', goToWritePage);

// 화면이 켜지면 '0번 페이지(첫 페이지)'를 가져오도록 변경
document.addEventListener('DOMContentLoaded', () => {
  fetchPosts(0);
});


// === 3. 함수 정의 ===

function goToWritePage() {
  window.location.href = 'write.html';
}

/**
 * 서버에서 게시글 목록을 가져오는 함수 (페이지 번호 추가!)
 * @param {number} page - 가져올 페이지 번호 (0부터 시작)
 */
function fetchPosts(page) {
  // 쿼리 스트링(?page=번호) 추가
  fetch(`http://localhost:8080/api/notice?page=${page}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('데이터 로딩 실패: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      // data가 이제 List가 아니라 Page 객체입니다.
      // 알맹이(content)와 페이지 정보(totalPages 등)를 나눠서 보냅니다.
      renderPosts(data.content, data.totalElements, data.number, data.size);
      renderPagination(data.totalPages, data.number);
    })
    .catch(error => {
      console.error('Error fetching posts:', error);
      renderError(error.message);
    });
}

/**
 * 목록 그리기 함수
 * @param {Array} posts - 게시글 데이터 배열
 * @param {number} totalElements - 전체 게시글 수 (번호 계산용)
 * @param {number} currentPage - 현재 페이지 번호 (번호 계산용)
 */
function renderPosts(posts, totalElements, currentPage, pageSize) {
  postListBody.innerHTML = '';

  // Page 객체의 content가 비어있는지 확인
  if (!posts || posts.length === 0) {
    postListBody.innerHTML = `<tr><td colspan="4" class="loading-cell">작성된 글이 없습니다.</td></tr>`;
    return;
  }

  posts.forEach((post, index) => {
    // [번호 계산] 전체개수 - (현재페이지 * 10) - 인덱스
    // 예: 100개 글, 0페이지 첫 글 -> 100 - 0 - 0 = 100번
    const displayNum = (currentPage * pageSize) + index + 1;

    // ⚠️ [중요 체크] DTO 필드명이 'createdDate'인지 'createdAt'인지 확인 필요!
    // 작성자님 코드에 createdAt으로 되어 있어서 일단 유지했습니다.
    // 만약 날짜가 안 나오면 createdDate 로 바꿔보세요.
    const fullDateTime = post.createdAt || post.createdDate;
    const dateOnly = fullDateTime ? fullDateTime.split('T')[0] : '날짜 없음';

    const tr = document.createElement('tr');
    tr.innerHTML = `
            <td class="col-num">${displayNum}</td>
            <td class="col-title">
                <a href="detail.html?id=${post.id}">${post.title}</a>
            </td>
            <td class="col-author">${post.author}</td>
            <td class="col-date">${dateOnly}</td>
        `;
    postListBody.appendChild(tr);
  });
}

/**
 * [신규] 페이지네이션 버튼 그리기 함수
 */
function renderPagination(totalPages, currentPage) {
  paginationArea.innerHTML = ''; // 기존 버튼 초기화

  if (totalPages === 0) return;

  // 0페이지부터 totalPages-1 까지 반복
  for (let i = 0; i < totalPages; i++) {
    const btn = document.createElement('button');
    btn.innerText = i + 1; // 화면에는 1부터 표시

    // 스타일 (CSS로 빼도 됨)
    btn.style.margin = "0 5px";
    btn.style.padding = "5px 10px";
    btn.style.cursor = "pointer";
    btn.style.border = "1px solid #ccc";
    btn.style.backgroundColor = "#fff";

    // 현재 페이지 강조
    if (i === currentPage) {
      btn.style.backgroundColor = "#333";
      btn.style.color = "#fff";
      btn.style.fontWeight = "bold";
    }

    // 버튼 클릭 시 해당 페이지 로드
    btn.onclick = () => {
      fetchPosts(i);
    };

    paginationArea.appendChild(btn);
  }
}

function renderError(message) {
  postListBody.innerHTML = `<tr><td colspan="4" class="error-cell">오류 발생: ${message}</td></tr>`;
}
