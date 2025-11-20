// === 1. DOM 요소 선택 ===
// HTML에서 id="post-list-body" 인 요소를 찾아서 변수에 담습니다.
const postListBody = document.getElementById('post-list-body');
// HTML에서 id="new-post-btn" 인 요소를 찾아서 변수에 담습니다.
const newPostButton = document.getElementById('new-post-btn');


// === 2. 이벤트 리스너 연결 ===
// '새 글 작성' 버튼(#new-post-btn)에 클릭 이벤트 리스너를 연결합니다.
newPostButton.addEventListener('click', goToWritePage);

// HTML 문서 로딩이 완료되면(DOMContentLoaded), 서버에서 데이터를 가져옵니다.
document.addEventListener('DOMContentLoaded', fetchPosts);


// === 3. 함수 정의 ===

/**
 * '새 글 작성' 페이지로 이동하는 함수
 */
function goToWritePage() {
  // 'write.html' 페이지로 이동합니다.
  window.location.href = 'write.html';
}

/**
 * (중요) Spring 서버에서 게시글 목록을 가져오는 함수
 */
function fetchPosts() {
  // API 엔드포인트(/api/notice)로 GET 요청을 보냅니다.
  // (⚠️ 주의: http://localhost:8080/api/notice 처럼 전체 URL이 필요할 수 있습니다.)

  fetch('http://localhost:8080/api/notice')
    .then(response => {
      // 서버 응답이 정상(200번대)인지 확인
      if (!response.ok) {
        // 응답이 실패하면 에러를 발생시킵니다.
        throw new Error('데이터 로딩에 실패했습니다. 상태: ' + response.status);
      }
      // 서버 응답을 JSON 형태로 파싱(변환)하여 반환
      return response.json();
    })
    .then(data => {
      // 성공적으로 받아온 데이터(data)로 목록을 렌더링
      renderPosts(data);
    })
    .catch(error => {
      // 통신 또는 처리 중 에러가 발생하면 에러 화면을 표시
      console.error('Error fetching posts:', error);
      renderError(error.message);
    });
}

/**
 * 받아온 데이터(posts)로 화면에 목록을 그려주는 함수
 * @param {Array} posts - 서버에서 받은 게시글 객체 배열
 */
function renderPosts(posts) {
  // <tbody> 내부를 일단 비웁니다.
  postListBody.innerHTML = '';

  // 만약 데이터가 없다면
  if (!posts || posts.length === 0) {
    postListBody.innerHTML = `
            <tr>
                <td colspan="4" class="loading-cell">작성된 글이 없습니다.</td>
            </tr>
        `;
    return; // 함수 종료
  }

  // 데이터 배열을 순회하면서(forEach) 각 게시글에 대한 HTML을 생성합니다.
  posts.forEach(post => {
    // [작성일 처리] 서버에서 온 날짜/시간 문자열에서 날짜 부분만 추출 (예: 2025-11-20)
    // Spring DTO의 필드명(예: createdAt)과 post.date가 일치해야 함
    const fullDateTime = post.createdAt;
    const dateOnly = fullDateTime ? fullDateTime.split('T')[0] : '날짜 없음';

    // 새로운 <tr> (테이블 행) 요소를 생성합니다.
    const tr = document.createElement('tr');

    // <tr> 내부에 들어갈 HTML을 구성합니다.
    tr.innerHTML = `
            <td class="col-num">${post.id}</td>
            <td class="col-title">
                <a href="detail.html?id=${post.id}">${post.title}</a>
            </td>
            <td class="col-author">${post.author}</td>
            <td class="col-date">${dateOnly}</td>
        `;

    // 완성된 <tr>을 <tbody>에 자식 요소로 추가합니다.
    postListBody.appendChild(tr);
  });
}

/**
 * 데이터 로딩 중 에러가 발생했을 때 호출되는 함수
 * @param {string} message - 표시할 에러 메시지
 */
function renderError(message) {
  postListBody.innerHTML = `
        <tr>
            <td colspan="4" class="error-cell">
                오류 발생: ${message}
            </td>
        </tr>
    `;
}
