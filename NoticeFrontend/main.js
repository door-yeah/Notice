// === 1. DOM 요소 선택 ===
const postListBody = document.getElementById('post-list-body');
const newPostButton = document.getElementById('new-post-btn');
const paginationArea = document.getElementById('pagination-area');
const searchInput = document.getElementById('search-input'); // [추가] 검색 입력창
const searchBtn = document.getElementById('search-btn');     // [추가] 검색 버튼

// === 2. 상태 변수 ===
let currentKeyword = ''; // [추가] 현재 검색어를 저장해두는 변수

// === 3. 이벤트 리스너 연결 ===
document.addEventListener('DOMContentLoaded', () => {
  fetchPosts(0); // 처음엔 0페이지 로드
});

newPostButton.addEventListener('click', () => {
  window.location.href = 'write.html';
});

// [추가] 검색 버튼 클릭 시
searchBtn.addEventListener('click', () => {
  performSearch();
});

// [추가] 검색창에서 엔터(Enter) 키 눌렀을 때
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    performSearch();
  }
});

// === 4. 함수 정의 ===

/**
 * 검색을 수행하는 함수
 * 1. 검색어를 변수에 저장하고
 * 2. 0페이지부터 다시 조회합니다.
 */
function performSearch() {
  currentKeyword = searchInput.value; // 입력된 값 저장
  fetchPosts(0); // 검색했으니 1페이지(index 0)부터 다시 보여줌
}

/**
 * 서버에서 게시글 목록을 가져오는 함수
 */
function fetchPosts(page) {
  // 기본 URL
  let url = `http://localhost:8080/api/notice?page=${page}`;

  // [중요] 검색어가 있으면 URL 뒤에 붙임 (&keyword=검색어)
  if (currentKeyword) {
    // encodeURIComponent: 한글이나 특수문자가 깨지지 않게 변환
    url += `&keyword=${encodeURIComponent(currentKeyword)}`;
  }

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('데이터 로딩 실패: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      // data.size(페이지당 개수)도 같이 넘겨줌
      renderPosts(data.content, data.totalElements, data.number, data.size);
      renderPagination(data.totalPages, data.number);
    })
    .catch(error => {
      console.error('Error:', error);
      renderError(error.message);
    });
}

/**
 * 목록 그리기 함수
 */
function renderPosts(posts, totalElements, currentPage, pageSize) {
  postListBody.innerHTML = '';

  if (!posts || posts.length === 0) {
    postListBody.innerHTML = `<tr><td colspan="4" class="loading-cell">검색 결과가 없습니다.</td></tr>`;
    return;
  }

  posts.forEach((post, index) => {
    // [번호 계산] 전체 - (현재페이지 * 사이즈) - 인덱스
    const displayNum = (currentPage * pageSize) + index + 1;

    // 날짜 처리 (createdAt 혹은 createdDate)
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
 * 페이지네이션 버튼 그리기
 */
function renderPagination(totalPages, currentPage) {
  paginationArea.innerHTML = '';

  if (totalPages === 0) return;

  for (let i = 0; i < totalPages; i++) {
    const btn = document.createElement('button');
    btn.innerText = i + 1;

    // 버튼 스타일
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

    // 버튼 클릭 시 (중요: 검색어 상태인 currentKeyword가 유지됨)
    btn.onclick = () => {
      fetchPosts(i);
    };

    paginationArea.appendChild(btn);
  }
}

function renderError(message) {
  postListBody.innerHTML = `<tr><td colspan="4" class="error-cell">오류 발생: ${message}</td></tr>`;
}
