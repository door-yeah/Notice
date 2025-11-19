const saveButton = document.getElementById('save-btn');
const backButton = document.getElementById('back-btn');

// 1. '목록으로' 버튼 클릭 시
backButton.addEventListener('click', () => {
  // 뒤로 가기 (또는 목록 페이지로 이동)
  window.history.back();
  // window.location.href = 'list.html'; // 명시적으로 이동하려면 이걸 쓰세요
});

// 2. '작성 완료' 버튼 클릭 시
saveButton.addEventListener('click', () => {
  // 입력값 가져오기
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const content = document.getElementById('content').value;

  // 유효성 검사 (빈 값 체크)
  if (!title || !author || !content) {
    alert("제목, 작성자, 내용을 모두 입력해주세요.");
    return;
  }

  // 서버로 보낼 데이터 객체 생성
  // (주의) Spring Controller의 NoticeRequest DTO 필드명과 일치해야 합니다!
  const newPost = {
    title: title,
    author: author,
    content: content
  };

  // 서버에 POST 요청 보내기
  fetch('http://localhost:8080/api/notice', { // 전체 URL이 필요하면 http://localhost:8080/api/notice
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newPost) // 객체를 JSON 문자열로 변환
  })
    .then(response => {
      if (response.ok) {
        alert("글이 성공적으로 등록되었습니다!");
        window.location.href = 'list.html'; // 목록 페이지로 이동
      } else {
        alert("글 등록에 실패했습니다.");
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert("서버 통신 중 오류가 발생했습니다.");
    });
});
