// === 1. DOM 요소 선택 ===
// HTML의 'id="post-list-body"'와 'id="new-post-btn"'를
// JavaScript가 제어할 수 있도록 변수에 담아둡니다.
const postListBody = document.getElementById('post-list-body');
const newPostButton = document.getElementById('new-post-btn');


// === 2. 이벤트 리스너 연결 ===
// "새 글 작성" 버튼(newPostButton)이 'click'되면,
// 'goToWritePage' 함수를 실행하라고 미리 약속(연결)해둡니다.
newPostButton.addEventListener('click', goToWritePage);

// HTML 문서가 '모두 로드되면(DOMContentLoaded)',
// 'fetchPosts' 함수를 실행하라고 약속(연결)해둡니다.
// (페이지가 열리자마자 바로 실행됩니다)
document.addEventListener('DOMContentLoaded', fetchPosts);


// === 3. 함수 정의 ===

/** '새 글 작성' 페이지로 이동하는 함수 */
function goToWritePage() {
  window.location.href = 'write.html'; // 페이지 이동
}

/** * (가장 중요!) Spring 서버에서 게시글 목록을 가져오는 함수
 */
function fetchPosts() {

  // 1. 스프링 컨트롤러(@GetMapping)에 정의된 주소로 요청을 보냅니다.
  fetch('http://localhost:8080/api/notice')
    .then(response => {
      // 2. 서버가 응답하면, 그 응답이 정상인지(ok) 확인합니다.
      if (!response.ok) {
        throw new Error('데이터 로딩 실패');
      }
      // 3. 정상 응답이면, JSON 데이터를 JavaScript 객체로 변환합니다.
      return response.json();
    })
    .then(data => {
      // 4. 변환된 데이터(data)를 'renderPosts' 함수에게 넘겨줍니다.
      // (이 data가 Spring의 List<NoticeResponse> 입니다.)
      renderPosts(data);
    })
    .catch(error => {
      // 5. 1~4번 과정 중 어디서든 에러가 나면 여기로 옵니다.
      console.error('Error fetching posts:', error);
      renderError(error.message); // 에러 화면을 표시합니다.
    });
}

/** * (두 번째로 중요!) 받아온 데이터로 화면을 그리는 함수
 */
function renderPosts(posts) { // posts는 서버에서 받은 데이터 배열
  // 1. "로딩 중..." 메시지를 지우기 위해 <tbody>를 비웁니다.
  postListBody.innerHTML = '';

  // 2. 만약 글이 하나도 없다면
  if (!posts || posts.length === 0) {
    postListBody.innerHTML = `<tr><td colspan="4" class="loading-cell">작성된 글이 없습니다.</td></tr>`;
    return;
  }

  // 3. posts 배열을 하나씩 순회(forEach)합니다.
  posts.forEach(post => {
    // 4. 각 'post' 객체를 위한 <tr>(테이블 행)을 새로 만듭니다.
    const tr = document.createElement('tr');

    // 5. <tr> 안에 채워 넣을 HTML을 만듭니다.
    //    (주의!) post.id, post.title 등이 Spring DTO의 필드명과 같아야 합니다.
    tr.innerHTML = `
            <td class="col-num">${post.id}</td>
            <td class="col-title">
                <a href="detail.html?id=${post.id}">${post.title}</a>
            </td>
            <td class="col-author">${post.author}</td>
            <td class="col-date">${post.date}</td>
        `;

    // 6. 완성된 <tr>을 <tbody>(postListBody)에 추가합니다.
    postListBody.appendChild(tr);
  });
}

/** 에러가 발생했을 때 화면에 표시하는 함수 */
function renderError(message) {
  postListBody.innerHTML = `<tr><td colspan="4" class="error-cell">오류 발생: ${message}</td></tr>`;
}
